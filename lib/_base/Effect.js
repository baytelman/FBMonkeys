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

export class EnablerEffect extends Effect {
  constructor({type=null, amount=0, multiplier=1} = {}) {
    super(arguments[0]);
    this.type = type;
    this.amount = amount;
    this.multiplier = multiplier;
  }

  static cumulativeBaseEnabledAmount(type, effects) {
    let sum = 0;
    effects.forEach(function(e) {
      if (e instanceof EnablerEffect && e.type === type) {
        sum += e.amount;
      }
    });
    if (sum < 0) {
      sum = 0;
    }
    return sum;
  }

  static cumulativeEnabledMultiplier(type, effects) {
    let multiplier = 1;
    effects.forEach(function(e) {
      if (e instanceof EnablerEffect && e.type === type) {
        multiplier *= e.multiplier;
      }
    });
    return multiplier;
  }

  static enabledAmount(type, effects) {
    let amount = EnablerEffect.cumulativeBaseEnabledAmount(type, effects);
    amount *= EnablerEffect.cumulativeEnabledMultiplier(type, effects);
    return amount;
  }
}

export class EnableResourceEffect extends EnablerEffect {

}
