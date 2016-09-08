var UUIDjs = require('uuid-js');
var UtilsJS = require('./utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

export class Event {
  constructor({type = "event", object = null, data = {}} = {}) {
    this.id = UUIDjs.create().toString();

    this.type = type;
    this.object = MutableObject.copy(object);
    this.data = MutableObject.copy(data);
  }
  toString() {
    return "[" + this.type + "] " + this.object;
  }
}
