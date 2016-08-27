class CityPlayer extends Player {
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
}

class PlayerEarnResourceEffect extends ResourceGeneratingEffect {
  updateTime(deltaSeconds, parents) {
    let generated = super.updateTime(deltaSeconds);
    parents.player.earnResources(generated);
    return generated;
  }
}
