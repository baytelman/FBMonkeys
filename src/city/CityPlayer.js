class CityPlayer extends Player {
    constructor({city = new City()} = {}) {
    super(arguments[0]);
    this.city = city;
  }
  updateTime(deltaSeconds, parents) {
    let updated = super.updateTime(deltaSeconds);
    updated = updated.concat(this.city.updateTime(deltaSeconds, {
      player: this
    }));
    return updated;
  }
}

class ResourceGeneratingEffect extends Effect {
  constructor({resources=[], frequency=1} = {}) {
    super();
    this.resources = resources;
    this.frequency = frequency;

    this.cycleStart = null;
  }
  updateTime(deltaSeconds, parents) {
    let generated = [];
    if (this.cycleStart === null) {
      this.cycleStart = parents.building.buildTime;
    }
    while (parents.building.time >= this.cycleStart + this.frequency) {
      this.cycleStart += this.frequency;
      generated = generated.concat(this.resources);
    }
    parents.player.earnResources(generated);
    return generated;
  }
}
