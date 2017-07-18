const UUIDjs = require('uuid-js');
const UtilsJS = require('./utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

export class Effect {
  constructor({frequency=1} = {}) {
    this.id = UUIDjs.create().toString();
    this.frequency = frequency;
    
    this.cycleStart = 0;
    this.time = 0;
  }
  updateTime(deltaSeconds, parents) {
    this.time += deltaSeconds;
    let updated = [];
    while (this.time >= this.cycleStart + this.frequency) {
      this.cycleStart += this.frequency;
      updated = updated.concat(this.trigger(parents));
    }
    return updated;
  }
  getStatus() {
    let progress = (this.time - this.cycleStart) / this.frequency;
    return "[" + Math.round(progress*100) + "% Progress]";
  }
  
  trigger() {
    // Implement in sub-classes
    return [];
  }
  
  toString() {
    return this.constructor.name + " (" + this.id + ")";
  }
}
