class ImmutableObjectError extends Error {

}
class MutableObject {
  static checkIsMutable(object) {
    if (!object.isMutable) {
      throw new ImmutableObjectError();
    }
  }
  static mutableCopy(obj) {
    let a = Object.create(Object.getPrototypeOf(obj))
    a = Object.assign(a, obj);
    a.isMutable = true;
    return a;
  }
}
