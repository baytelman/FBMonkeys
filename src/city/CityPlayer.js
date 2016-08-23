class CityPlayer extends Player {
    constructor(name) {
      super(name);
        this.city = new City();
    }
    updateTime(deltaSeconds) {
      let updated = super.updateTime(deltaSeconds);
        updated = updated.concat(this.city.updateTime(deltaSeconds));
        return updated;
    }
}
