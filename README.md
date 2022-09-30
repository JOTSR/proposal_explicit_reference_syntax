# Explicit Reference Syntax

## Status

**Stage:**

**Author:** [JOTSR](https://github.com/JOTSR)

**Champions:**

## Overview / Motivation

Reference to variable is actually implicit in JS and depend on the type. In order to avoid mistake and unexpected behavior I suggest this new syntax. Moreover, it is common to encapsulate a primitive into an object (eg.: array) to reference it. This syntax also aims to prevent global mutable variable declaration used implicitly in functions and give a way to explicitly call them.

## Syntax

This syntax introduce 2 new sigil
- @var (read only reference)
- &var (read write reference)

Read only references are seen like deep freeze object or const primitives

For variable declaration: sigil is mandtory in reference name from declaration to the end of use
For function: sigil is mandatory in arguments declaration and for arguments call (throws a type error else)

const delared references can't be reassigned
let declared refenrences can be rassigned

```ts
let source
let source2

const &constRef = source
let &letRef = source

&constRef = source2 //error, can't reassign const reference
&letRef  source2 //ok
```

&var can't reference a const declared primitive
A variable can't have multiple mutable reference to prevent memory race

```ts
const source = /* any */

const &ref1 = source
const &ref2 = source //Error, source has already a mutable referenced
```

## Examples

### Global scope parameter

Old way
```ts
let userId = 0

async function getNextUser(url) {
    const raw = await fetch(`${url}?id=${userId++}`)
    return await raw.json()
}

await getNexUser(url)
```

With references
```ts
let userId = 0

async function getNextUser(url, &userId) {
    const raw = await fetch(`${url}?id=${&userId++}`)
    return await raw.json()
}

await getNexUser(url, &userId)
```

### Safe reference passing

```ts
const array = [1, 2, 3, 4]

computeOnArray(@array) //throws if array is mutate (secure use of the function)
```

### New short notations and syntax help

```ts
const array = @[1, 2, 3, 4] //Create an explicit deep freezed array with a simple and clear syntax
const object = @{ key: 'value' } //Same for object
const fn = @function () {} //Or function
```

### Counter

```ts
let counter = 0
const counter2 = 0

function increment(&counter) {
    &couter++
}

increment(&counter)
increment(&counter2) //Type error, counter2 refers to a const

console.assert(counter === 1)
```

### Call tracker

Track call on function without unknown global mutable variable, specifiyng all context to avoid mistakes.

```ts
let counter = 0

function someFunction(args, &counter) {
    // stuff
    &couter++
}

setInterval(() => someFunction(args, &counter), 200)
```

### Classic arguments declaration

```ts
function foo(arg0) {
    //
}

let &a

let @b

foo(&a) //Same behaviour as classic declaration for object and reference behaviour for primitives
foo(@b) //throws if foo try to mutate @b, prevent unexpected behaviour
```

### Explicit referencing

```ts
const a = [1, 2, 3]
const &b = a //explicit reference, no ambiguiti
const @c = a //c refers to a but can only access to deepFreeze(a)

&b.push(1) //no error
@c.push(1) //Type error, object is not extensible
```

### {{title}}

## FAQs
- &var referencing const declared object can be confusing, should it be forbidden ?
- @ and & sigil choice ?