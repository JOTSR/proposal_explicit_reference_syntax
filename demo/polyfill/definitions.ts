export {}

declare global {
	interface SymbolConstructor {
		readonly references: unique symbol
		readonly referencer: unique symbol
	}

	interface Object {
		[Symbol.references]: { hasMut: boolean, noCollect: WeakSet<Reference> }
		[Symbol.referencer]: (ref: Reference) => this
	}
}

Object.assign(Symbol, { references: Symbol('references'), referencer: Symbol('referencer') })

Object.prototype[Symbol.references] = { hasMut: false, noCollect: new WeakSet() }

Object.prototype[Symbol.referencer] = function(ref: Reference) {
    if (this[Symbol.references].hasMut) throw new ReferenceError(`${String(this)} has already one mutable reference`)
    this[Symbol.references].noCollect.add(ref)
    this[Symbol.references].hasMut = ref.type === 'mut'
    return this
}

class Reference {
    #null = Symbol('null')
    #reassigneable: boolean
    #ref: unknown = this.#null
    constructor({ reassigneable }: { reassigneable: boolean }) {
        this.#reassigneable = reassigneable
    }

    get reassigneable() {
        return this.#reassigneable
    }

    get type(): 'mut' | 'immut' {
        throw new Error('Not implemented')
    }

    set ref(value: unknown) {
        if (!this.#reassigneable && (this.#ref !== this.#null)) {
            throw new TypeError('Trying to reassign a const defined reference')
        }
        this.#ref = value
    }

    get ref() {
        if (this.#ref === this.#null) {
            throw new ReferenceError('Accessed before assignement, explicit references can\'t be null')
        }
        return this.#ref
    }
}

export class MutableRef extends Reference {
    constructor({ reassigneable }: { reassigneable: boolean }) {
        super({ reassigneable })
    }

    get type(): 'mut' {
        return 'mut'
    }
}

export class ImmutableRef extends Reference {
    constructor({ reassigneable }: { reassigneable: boolean }) {
        super({ reassigneable })
    }

    get type(): 'immut' {
        return 'immut'
    }
}