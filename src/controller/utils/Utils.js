import UUIDjs from 'uuid-js';

export class ImmutableObjectError extends Error {}
export class MutableObject {
  static checkIsMutable(object) {
    if (!object.isMutable) {
      throw new ImmutableObjectError();
    }
  }
  static mutableCopy(obj) {
    if (!obj) {
      return obj;
    }
    let a = Object.create(Object.getPrototypeOf(obj));
    a = Object.assign(a, obj);
    a.isMutable = true;
    a.id = UUIDjs.create().toString();
    a.originalId = a.originalId || obj.id;
    return a;
  }
  static copy(obj) {
    if (!obj) {
      return obj;
    }
    let a = Object.create(Object.getPrototypeOf(obj));
    a = Object.assign(a, obj);
    return a;
  }
}

export class Geometry {
  static compare = (b1, b2) => {
    return (b1.y - b2.y) * 1000 + (b1.x - b2.x);
  };
  static dedup = hexs => {
    let unique = {};
    for (let hex of hexs) {
      unique[JSON.stringify(hex)] = hex;
    }
    return Object.values(unique).sort(Hex.compare);
  };
  static remove = (origin, needles) => {
    let unique = {};
    for (let { x, y } of origin) {
      unique[JSON.stringify({ x, y })] = { x, y };
    }
    for (let { x, y } of needles) {
      delete unique[JSON.stringify({ x, y })];
    }
    return Object.values(unique).sort(Hex.compare);
  };
  static coordinates = function() {
    throw new Error('Implement coordinates');
  };
  static computeEdges = function(spots, { width, height }) {
    const { minX, maxX, minY, maxY } = spots.reduce(
      ({ minX, maxX, minY, maxY }, spot) => ({
        minX: Math.min(minX, spot.x),
        minY: Math.min(minY, spot.y),
        maxX: Math.max(maxX, spot.x),
        maxY: Math.max(maxY, spot.y)
      }),
      { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    );
    const leftTop = this.coordinates({
      x: minX - 1,
      y: minY - 1,
      width,
      height
    });
    const rightBottom = this.coordinates({
      x: maxX + 2,
      y: maxY + 2,
      width,
      height
    });
    return {
      minX,
      maxX,
      minY,
      maxY,
      left: leftTop.x,
      top: leftTop.y,
      right: rightBottom.x,
      bottom: rightBottom.y
    };
  };
}

export class Square extends Geometry {
  static neightbors = ({ x, y }) => {
    return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
  };
  static coordinates = ({ x, y, width, height }) => {
    return {
      x: width * (x - 0.5),
      y: height * (y - 0.5)
    };
  };
}
export class Hex extends Geometry {
  static neightbors = ({ x, y }) => {
    return [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x, y: y + 1 },
      { x: x - 1, y: y + 1 }
    ];
  };
  static coordinates = function({ x, y, width, height }) {
    return {
      left: width * (x + y / 2 - 0.5),
      top: height * ((y * 3) / 4 - 0.5)
    };
  };
}
