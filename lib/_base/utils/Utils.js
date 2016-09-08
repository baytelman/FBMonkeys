var UUIDjs = require('uuid-js');

export class ImmutableObjectError extends Error {

}
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
    let a = Object.create(Object.getPrototypeOf(obj))
    a = Object.assign(a, obj);
    a.isMutable = true;
    a.id = UUIDjs.create().toString();
    return a;
  }
  static copy(obj) {
    if (!obj) {
      return obj;
    }
    let a = Object.create(Object.getPrototypeOf(obj))
    a = Object.assign(a, obj);
    return a;
  }
}

if (!Object.values) {
  Object.values = function(obj) {
    let values = [];
    for (let key in obj) {
      values.push(obj[key]);
    }
    return values;
  }
}
