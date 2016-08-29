var PlayerJS = require('../_base/Player.js');
var CityJS = require('./City.js')

var Player = PlayerJS.Player;
var City = CityJS.City;

var EffectJS = require('../_base/Effect.js');
var ResourceGeneratingEffect = EffectJS.ResourceGeneratingEffect;

export class CityPlayer extends Player {
  constructor({city = new City()} = {}) {
    super(arguments[0]);
    this.city = city;
    this.characters = [];
  }
  updateTime(deltaSeconds) {
    let parents = {
      player: this
    };
    let updated = super.updateTime(deltaSeconds);
    this.characters.concat([this.city]).map(function(children) {
      updated = updated.concat(children.updateTime(deltaSeconds, parents));
    });
    return updated;
  }
  addCharacter(character) {
    this.characters.push(character);
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

export class PlayerEarnResourceEffect extends ResourceGeneratingEffect {
  updateTime(deltaSeconds, parents) {
    let generated = super.updateTime(deltaSeconds);
    parents.player.earnResources(generated);
    return generated;
  }
}
