import './polyfill/definitions.ts'
import { MutableRef, ImmutableRef } from './polyfill/definitions.ts'

//Mut examples
const ref0 = new MutableRef({ reassigneable: true });
// ref0.ref // error, ref can't be null

const ref1 = new MutableRef({ reassigneable: true }); ref1.ref = ([])[Symbol.referencer](ref1);
ref1.ref = ([1])[Symbol.referencer](ref1); //ok
ref1.ref.push(2) //ok

const ref2 = new MutableRef({ reassigneable: false }); ref2.ref = ([1])[Symbol.referencer](ref2);
ref2.ref = ([2])[Symbol.referencer](ref2); //error
ref2.ref.push(3) //ok

const arr = [1, 2]
const ref3 = new MutableRef({ reassigneable: false }); ref3.ref = (arr)[Symbol.referencer](ref3);
const ref4 = new MutableRef({ reassigneable: false }); ref4.ref = (arr)[Symbol.referencer](ref4); //error

//Immut examples
const iref0 = new ImmutableRef({ reassigneable: true });
iref0.ref // error, ref can't be null

const iref1 = new ImmutableRef({ reassigneable: true }); iref1.ref = ([])[Symbol.referencer](iref1);
iref1.ref = ([1])[Symbol.referencer](iref1); //ok
iref1.ref.push(2) //ok

const iref2 = new ImmutableRef({ reassigneable: false }); iref2.ref = ([1])[Symbol.referencer](iref2);
iref2.ref = ([2])[Symbol.referencer](iref2); //error
iref2.ref.push(3) //ok

const arr2 = [1, 2]
const iref3 = new ImmutableRef({ reassigneable: false }); iref3.ref = (arr2)[Symbol.referencer](iref3);
const iref4 = new ImmutableRef({ reassigneable: false }); iref4.ref = (arr2)[Symbol.referencer](iref4); //error