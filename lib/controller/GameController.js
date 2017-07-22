
const CitySerializer = require("../city/CitySerializer.js").default;
const CityPlayer = require('../city/CityPlayer.js').default;
const GameModule = require('../module/GameModule.js').default;
const EventEmitter = require('events');

export default class GameController extends EventEmitter {
  constructor() {
    super();
    this.module = new GameModule();
    this.startNewGame();
  }

  _emit(event) {
    this.emit(event.type, event.object, event.data);
  }

  startNewGame() {
    this.player = new CityPlayer();
  }

  getAllMyBuilding() {
    return JSON.parse(CitySerializer.serialize(this.player.city.buildings));
  }

  getBuilding(id) {
    return JSON.parse(CitySerializer.serialize(this.player.city.buildings[id]));
  }

  tick(delta) {
    let _this = this;
    let events = this.player.updateTime(delta);
    events.forEach((event) => _this._emit(event));
    return events;
  }

  planBuilding(id) {
    let b = this.module.availableBuildings()[id];
    let event = this.player.city.planBuilding({
      building: b
    });
    this._emit(event);
    return event;
  }

  installCompletedBuilding(id) {
    let event = this.planBuilding(id);
    let events = [event];
    let building = this.player.city.buildings[event.object.id];
    events.push(building.updateTime(building.buildingTime, {}));
    return events;
  }
}

GameController.instance = new GameController();
