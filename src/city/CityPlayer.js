class CityPlayer extends Player {
  constructor({name, resources, city = new City()} = {}) {
    super(name);
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
