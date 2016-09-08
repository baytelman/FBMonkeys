const assert = require('chai').assert
const A = require("./utils/inheritance_helpers.js").A;
const B = require("./utils/inheritance_helpers.js").B;

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
