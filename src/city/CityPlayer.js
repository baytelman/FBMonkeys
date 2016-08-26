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

    this.cycleStart = 0;
    this.time = 0;
  }
  updateTime(deltaSeconds, parents) {
    this.time += deltaSeconds;
    let generated = [];
    while (this.time >= this.cycleStart + this.frequency) {
      this.cycleStart += this.frequency;
      generated = generated.concat(this.resources);
    }
    parents.player.earnResources(generated);
    return generated;
  }
}
