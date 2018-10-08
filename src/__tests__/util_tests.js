import {assert} from 'chai';

import {MutableObject, ImmutableObjectError} from "../controller/utils/Utils";

export class A {
  constructor() {}
  test() {
    return "A";
  }
}

export class B extends A {
  constructor() {
    super();
  }
  test() {
    return "B";
  }
  copy() {
    return MutableObject.mutableCopy(this);
  }
}

describe('Inheritance and Mutation', () => {
  let a = new A();
  let b = new B();
  let copyOfB = b.copy();

  it('A returns A', () => {
    assert.strictEqual(a.test(), "A");
    assert.instanceOf(a, A);
  });
  it('B returns B', () => {
    assert.strictEqual(b.test(), "B");
    assert.instanceOf(b, B);
  });
  it('copyOfB returns B', () => {
    assert.strictEqual(copyOfB.test(), "B");
    assert.instanceOf(copyOfB, B);
  });
});

describe('Mutable objects', () => {
  it('can check if object is mutable', () => {
    const obj = {
      a: 'b'
    };
    const nonMutableObject = MutableObject.copy(obj);
    const callMutate = () => MutableObject.checkIsMutable(nonMutableObject);
    assert.throws(callMutate, Error);

    const mutableObject = MutableObject.mutableCopy(obj);
    assert.equal(mutableObject.a, obj.a);
  });
  it('cannot copy null', () => {
    assert.strictEqual(null, MutableObject.copy(null));
    assert.strictEqual(null, MutableObject.mutableCopy(null));
  });
});
