import './polyfill/definitions.ts'
import { MutableRef, ImmutableRef } from './polyfill/definitions.ts'

//Mut examples
let &ref0
// &ref0 // error, ref can't be null

let &ref1 = []
&ref1 = [1] //ok
&ref1.push(2) //ok

const &ref2 = [1]
&ref2 = [2] //error
&ref2.push(3) //ok

const arr = [1, 2]
const &ref3 = arr
const &ref4 = arr //error

//Immut examples
let @iref0
@iref0 // error, ref can't be null

let @iref1 = []
@iref1 = [1] //ok
@iref1.push(2) //ok

const @iref2 = [1]
@iref2 = [2] //error
@iref2.push(3) //ok

const arr2 = [1, 2]
const @iref3 = arr2
const @iref4 = arr2 //error