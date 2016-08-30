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
    let a = Object.create(Object.getPrototypeOf(obj))
    a = Object.assign(a, obj);
    a.isMutable = true;
    a.id = UUIDjs.create().toString();
    return a;
  }
}
