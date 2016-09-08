var CharacterOperationJS = require("../city/CharacterOperation.js");
var BuildingJS = require('../city/Building.js');

var SquareCoordinate = require("../_base/SquareCoordinate.js").SquareCoordinate;
var CitySerializer = require("../city/CitySerializer.js").CitySerializer;
var CityPlayer = require('../city/CityPlayer.js').CityPlayer;
var CityCharacter = CharacterOperationJS.CityCharacter;
var EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;
var InvestResourceInBuildingOperation = CharacterOperationJS.InvestResourceInBuildingOperation;

var Building = BuildingJS.Building;
var CityResource = require('../city/CityResource.js').CityResource;
var PlayerEarnResourceEffect = require("../city/CityPlayer.js").PlayerEarnResourceEffect;
var EventEmitter = require('events');

export class GameController extends EventEmitter {
  constructor() {
    super();
    this.module = new GameModule();
    this.player = null;
    GameController.instance = this;
  }

  _emit(event) {
    this.emit(event.type, event.object, event.data);
  }

  startNewGame() {
    this.player = new CityPlayer();
    this.player.addCharacter(this.module.createNewCharacter());
    this.player.addCharacter(this.module.createNewCharacter());
    this.player.addCharacter(this.module.createNewCharacter());
  }

  getAllMyCharacters() {
    return JSON.parse(CitySerializer.serialize(this.player.characters));
  }

  getCharacters(id) {
    return JSON.parse(CitySerializer.serialize(this.player.characters[id]));
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
    events.forEach(function(event) {
      _this._emit(event);
    });
  }

  planBuilding(id, x, y) {
    let b = this.module.availableBuildings()[id];
    let event = this.player.city.planBuilding({
      building: b,
      location: new SquareCoordinate(x, y)
    });
    this._emit(event);
  }
}

export class GameModule {
  constructor() {
  }
  createNewCharacter() {
    return GameModule.kWoodChopper;
  }
  availableBuildings() {
    return GameModule.kAvailableBuildings;
  }
}
GameModule.kFarm = new Building({
  name: "Farm",
  costs: [CityResource.wood(10)],
  effects: [new PlayerEarnResourceEffect({
    resources: [CityResource.food(1)],
    frequency: 50
  })]
});

GameModule.kWoodChopper = new CityCharacter({
  operations:[
    new EarnResourceForPlayerOperation({
      time: 10,
      resources: [new CityResource(CityResource.kResourceWood, 1)],
    }),
    new InvestResourceInBuildingOperation({
      time: 10,
    })
  ]
});

GameModule.kAvailableBuildings = {};
GameModule.kAvailableBuildings[GameModule.kFarm.id] = GameModule.kFarm;
