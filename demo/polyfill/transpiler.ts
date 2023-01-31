const source = await Deno.readTextFile('./example-in.ts')

//Transpile clone syntax
const transpiled = source
    //Transpile declaration + assignment
    .replaceAll(/(let|const) ((&|@)\w+) = (\S+)/g, (_, identifer, name, type, expression) => {
        name = name.slice(1) //remove sigil
        const refType = type === '&' ? 'MutableRef' : 'ImmutableRef'
        return `const ${name} = new ${refType}({ reassigneable: ${identifer === 'let' ? 'true' : 'false' } }); ${name}.ref = (${expression})[Symbol.referencer](${name});`
    })
    //Transpile declaration
    .replaceAll(/(let|const) ((&|@)\w+)/g, (_, identifer, name, type) => {
        name = name.slice(1) //remove sigil
        const refType = type === '&' ? 'MutableRef' : 'ImmutableRef'
        return `const ${name} = new ${refType}({ reassigneable: ${identifer === 'let' ? 'true' : 'false' } });`
    })
    //Transpile assignement
    .replaceAll(/((&|@)\w+) = (\S+)/g, (_, name, _type, expression) => {
        name = name.slice(1) //remove sigil
        return `${name}.ref = (${expression})[Symbol.referencer](${name});`
    })
    //Transpile getter
    .replaceAll(/((&|@)\w+)/g, (_, name, _type) => {
        name = name.slice(1) //remove sigil
        return `${name}.ref`
    })

await Deno.writeTextFile('./example-out.ts', transpiled)

{
    `
    let &ref0
    &ref0 // error, ref can't be null

    let &ref1 = []
    &ref1 = [1] //ok
    &ref1.push(2) //ok
    
    const &ref2 = [1]
    &ref2 = [2] //error
    &ref2.push(3) //ok
    
    const arr = [1, 2]
    const &ref3 = arr
    const &ref4 = arr //error
    `
    ;`
    let ref1 = new MutableRef({ reassigneable: true }); ref1.ref = [][Symbol.referencer]()
    ref1.ref = [1][Symbol.referencer]() //ok
    ref1.ref.push(2) //ok
    
    const ref2 = new MutableRef({ reassigneable: false }); ref2.ref = [1][Symbol.referencer]()
    ref2.ref = [2][Symbol.referencer]() //error
    ref2.ref.push(3) //ok
    
    const arr = [1, 2]
    const ref3 = new MutableRef({ reassigneable: false }); ref3.ref = arr[Symbol.referencer]()
    const ref4 = new MutableRef({ reassigneable: false }); ref4.ref = arr[Symbol.referencer]() //error
    `
}