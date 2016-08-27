var PlayerJS = require('../_base/Player.js');
var CityJS = require('./City.js')

var Player = PlayerJS.Player;
var City = CityJS.City;

export class CityPlayer extends Player {
    constructor({city = new City()} = {}) {
    super(arguments[0]);
    this.city = city;
    this.name = "Sepi"
  }
  updateTime(deltaSeconds, parents) {
    let updated = super.updateTime(deltaSeconds);
    updated = updated.concat(this.city.updateTime(deltaSeconds, {
      player: this
    }));
    return updated;
  }
}
