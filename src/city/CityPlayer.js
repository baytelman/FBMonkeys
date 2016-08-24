class CityPlayer extends Player {
  constructor(name, city) {
    super(name);
    this.city = city || new City();
  }
  updateTime(deltaSeconds, parents) {
    let updated = super.updateTime(deltaSeconds);
    updated = updated.concat(this.city.updateTime(deltaSeconds, {
      player: this
    }));
    return updated;
  }
}
