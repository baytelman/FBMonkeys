var SquareCoordinateJS = require('../lib/_base/SquareCoordinate.js');
var SquareCoordinate = SquareCoordinateJS.SquareCoordinate;

var assert = require('chai').assert
describe('Coordinates', () => {
  let sq1 = new SquareCoordinate(5,5);
  it('can be compared', () => {
    var sq2 = new SquareCoordinate(5,5);
    var sq3 = new SquareCoordinate(5,4);
    assert(sq1.is(sq2));
    assert(!sq1.is(sq3));
  });
  it('list neighbors', () => {
    var sq1 = new SquareCoordinate(5,5);
    var sqNei = sq1.neighborCoordinates();
    assert.strictEqual(sqNei.length, 4, "4 neighbors");

    let neighbor = new SquareCoordinate(5, 4);
    assert.isTrue(neighbor.isIn(sqNei));

    sqNei.forEach(function(neighbor) {
      assert.strictEqual(sq1.distanceTo(neighbor), 1);
    });

    let removed = SquareCoordinate.removeFromSet(sqNei, [neighbor]);
    assert.isFalse(neighbor.isIn(removed));
  });
});
