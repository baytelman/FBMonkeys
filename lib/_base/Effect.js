const UUIDjs = require('uuid-js');
const UtilsJS = require('./utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

export class Effect {
  constructor({} = {}) {
      this.id = UUIDjs.create().toString();
  }
  toString() {
    return this.constructor.name + " (" + this.id + ")";
  }
}
