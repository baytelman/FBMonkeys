
tests.push(function testCoordinateBasics() {
  var sq1 = new SquareCoordinate(5,5);
  var sq2 = new SquareCoordinate(5,5);

  if (! sq1.is(sq2)) {
    throw new Error("Coordinates are the same");
  }

});

tests.push(function testCoordinateNeighbors() {
  var sq = new SquareCoordinate(5,5);
  var sqNei = sq.neighborCoordinates();

  if (sqNei.length != 4) {
    throw new Error("Wrong number of neighbors for square");
  }

  let neighbor = new SquareCoordinate(5, 4);
  if (!neighbor.isIn(sqNei)) {
    throw new Error("Neighbor should be in the list");
  }

  sqNei.forEach(function(neighbor) {
    if (sq.distanceTo(neighbor) > 1) {
      throw new Error("Wrong distance for sq neighbor");
    }
  });

  let removed = SquareCoordinate.removeFromSet(sqNei, [neighbor]);
  if (neighbor.isIn(removed)) {
    throw new Error("Neighbor should NOT be in the list");
  }

  if (removed.size != 3) {
    throw new Error("Wrong number of neighbors for square");
  }
});
