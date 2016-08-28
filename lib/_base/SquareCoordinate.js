/**
* Represents a coordinate in the board.
* It will represent either a character's current location or a seriers of steps a character will move through.
*/
export class SquareCoordinate {
  constructor(x, y) {
    if (x instanceof Object) {
      return this.constructor(x.x, x.y);
    }
    this.x = x;
    this.y = y;
  }
  copy() {
    return new SquareCoordinate(this.x, this.y);
  }

  /// Debug representation
  toString() {
    return "<{0}, {1}>".format(this.x, this.y);
  }
  /// Debug representation
  toJString() {
    var x = this.x >= 0? this.x : 'm' + Math.abs(this.x);
    var y = this.y >= 0? this.y : 'm' + Math.abs(this.y);
    return "_{0}_{1}_".format(x, y);
  }

  is(anotherCoordinate) {
    return this.x == anotherCoordinate.x && this.y == anotherCoordinate.y;
  }

  compareTo(anotherCoordinate) {
    if (this.y != anotherCoordinate.y) {
      return this.y - anotherCoordinate.y;
    }
    return this.x - anotherCoordinate.x;
  }

  /**
  * Calculate the minimun distance between 2 coordinates
  * @param {HexCoordinate} dest
  * @returns {number} Tile-distance between the 2 coordinates.
  */
  distanceTo(dest) {
    var vDist = Math.abs(this.y - dest.y);
    var hDist = Math.abs(this.x - dest.x);
    return vDist + hDist;
  }

  /**
  * List of neighbor tiles (up to 6). They might be out of the board
  * @returns {Array.<HexCoordinate>}
  */
  neighborCoordinates() {
    var n = [];

    n.push(new SquareCoordinate(this.x - 1, this.y));
    n.push(new SquareCoordinate(this.x + 1, this.y));
    n.push(new SquareCoordinate(this.x, this.y + 1));
    n.push(new SquareCoordinate(this.x, this.y - 1));

    return n;
  }

  // returns BOOL if coordinate is in array
  isIn(iterable) {
    let _goodError = new Error();

    var found = false;
    try {
      iterable.forEach(function(c) {
        if (this.is(c)) {
          throw _goodError;
        }
      }.bind(this));
    } catch (e) {
      if (e === _goodError) {
        return true;
      }
    }
    return false;
  }

  static addToSet(set1, iterable2) {
    let result = new Set(set1);
    iterable2.forEach(function(c2) {
      if (!c2.isIn(result)) {
        result.add(c2);
      }
    });
    return result;
  }

  static removeFromSet(set1, iterable2) {
    let result = new Set(set1);
    iterable2.forEach(function(c2) {
      set1.forEach(function(c1) {
        if (c1.is(c2)) {
          result.delete(c1);
        }
      });
    });
    return result;
  }

  static interpolate(coordArray, distance) {
    let result = [];

    let coordBetween = function(s, e, d) {
      let x = s.x;
      let y = s.y;

      let beyond = true;
      if (s.x < e.x) {
        x += d;
        if (x >= e.x) {
          x = e.x;
        } else {
          beyond = false;
        }
      } else if (s.x > e.x) {
        x -= d;
        if (x <= e.x) {
          x = e.x;
        } else {
          beyond = false;
        }
      }

      if (s.y < e.y) {
        y += d;
        if (y >= e.y) {
          y = e.y;
        } else {
          beyond = false;
        }
      } else if (s.y > e.y) {
        y -= d;
        if (y <= e.y) {
          y = e.y;
        } else {
          beyond = false;
        }
      }

      if (beyond) {
        return null;
      }
      return new SquareCoordinate(x,y);
    }

    for (let i = 0; i < coordArray.length-1; i++) {
      let s = coordArray[i];
      let e = coordArray[i+1];

      for (let d = 0, c = coordBetween(s, e, d); c; c = coordBetween(s, e, d += distance)) {
        result.push(c);
      }
    }
    return result;
  }
}
