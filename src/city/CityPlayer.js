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
