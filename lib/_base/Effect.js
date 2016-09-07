var UUIDjs = require('uuid-js');
var UtilsJS = require('./utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

export class Effect {
  constructor({} = {}) {
      this.id = UUIDjs.create().toString();
  }
  toString() {
    return this.constructor.name + " (" + this.id + ")";
  }
}
