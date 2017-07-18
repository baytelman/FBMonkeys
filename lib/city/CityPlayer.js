const PlayerJS = require('../_base/Player.js');
const CityJS = require('./City.js')
const UtilsJS = require('../_base/utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

const Player = PlayerJS.Player;
const City = CityJS.default;
const CityEvent = require('./CityEvent.js').CityEvent;

const EffectJS = require('../_base/Effect.js');
const Effect = EffectJS.Effect;

export default class CityPlayer extends Player {
  constructor({city = new City()} = {}) {
    super(arguments[0]);
    this.city = city;
  }
  updateTime(deltaSeconds) {
    let parents = {
      player: this
    };
    let updated = [];
    while(deltaSeconds > 0) {
      let d = Math.min(deltaSeconds, CityPlayer.timeGranularity);
      updated = updated.concat(this.city.updateTime(d, parents));
      updated = updated.concat(super.updateTime(d));
      deltaSeconds -= d;
    }
    return updated;
  }
  fulfillsRequirements(requirements) {
    let conditions = Object.values(this.city.buildings).map(b => b.isCompleted() && b.namespace);
    return requirements.every(req => conditions.indexOf(req) > -1);
  }
}

CityPlayer.timeGranularity = 0.25;

export class PlayerEarnResourceEffect extends Effect {
  constructor({resources=[], frequency=1} = {}) {
    super(arguments[0]);
    this.resources = resources;
  }
  trigger(parents) {
    let event = new CityEvent({
      type:CityEvent.kEarnResourceEvent,
      object:this,
      data:this.resources
    });
    parents.player.earnResources(this.resources);
    return [event];
  }
  toString() {
    return super.toString() + " [" + this.resources + " " + (this.time - this.cycleStart) + "/" + this.frequency + " @ " + this.time + "]";
  }
}
