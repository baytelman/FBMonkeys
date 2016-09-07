var PlayerJS = require('../_base/Player.js');
var CityJS = require('./City.js')
var UtilsJS = require('../_base/utils/Utils.js');
var MutableObject = UtilsJS.MutableObject;

var Player = PlayerJS.Player;
var City = CityJS.City;

var EffectJS = require('../_base/Effect.js');
var Effect = EffectJS.Effect;

export class CityPlayer extends Player {
  constructor({city = new City()} = {}) {
    super(arguments[0]);
    this.city = city;
    this.characters = {};
  }
  updateTime(deltaSeconds) {
    let parents = {
      player: this
    };
    let updated = [];
    while(deltaSeconds > 0) {
      let d = Math.min(deltaSeconds, CityPlayer.timeGranularity);

      Object.values(this.characters).concat([this.city]).map(function(children) {
        updated = updated.concat(children.updateTime(d, parents));
      });
      updated = updated.concat(super.updateTime(d));
      deltaSeconds -= d;
    }
    return updated;
  }
  addCharacter(character) {
    this.characters[character.id] = character;
  }
  highestPriorityPendingProjectInNeedOf(type) {
    let pending = this.city.buildings.filter((b) => {
      return ! b.isCompleted() && b.canCompleteResource(type);
    });
    if (pending.length > 0) {
      return pending[0];
    }
  }
  highestPriorityPendingProjectWeHaveResourcesFor() {
    let pending = this.city.buildings.filter((b) => {
      return b.canCompleteWithAnyOfResources(this.resources);
    });
    if (pending.length > 0) {
      return pending[0];
    }
  }
}

CityPlayer.timeGranularity = 0.25;

export class PlayerEarnResourceEffect extends Effect {
  constructor({resources=[], frequency=1} = {}) {
    super(arguments[0]);
    this.resources = resources;
    this.frequency = frequency;

    this.cycleStart = 0;
    this.time = 0;
  }
  toString() {
    return super.toString() + " [" + this.resources + " " + (this.time - this.cycleStart) + "/" + this.frequency + " @ " + this.time + "]";
  }
  updateTime(deltaSeconds, parents) {
    this.time += deltaSeconds;
    let updated = [];
    while (this.time >= this.cycleStart + this.frequency) {
      this.cycleStart += this.frequency;
      updated.push(MutableObject.copy(this));
      updated = updated.concat(this.resources);
      parents.player.earnResources(this.resources);
    }
    return updated;
  }
}
