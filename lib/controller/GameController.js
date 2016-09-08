const CharacterOperationJS = require("../city/CharacterOperation.js");
const BuildingJS = require('../city/Building.js');

const CitySerializer = require("../city/CitySerializer.js").CitySerializer;
const CityPlayer = require('../city/CityPlayer.js').CityPlayer;
const CityCharacter = CharacterOperationJS.CityCharacter;
const Building = BuildingJS.Building;
const CityResource = require('../city/CityResource.js').CityResource;
const PlayerEarnResourceEffect = require("../city/CityPlayer.js").PlayerEarnResourceEffect;
const EventEmitter = require('events');

export class GameController extends EventEmitter {
  constructor() {
    super();
    this.module = new GameModule();
    this.player = null;
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
    let updates = this.player.updateTime(delta);
    updates.forEach(function(event) {
      this.emit(event.type, event.object, event.data);
    });
  }

  addBuilding(id, x, y) {
    let b = this.module.availableBuilding()[id];
    this.player.city.addBuilding({
      building: b,
      location: new SquareCoordinate(x, y)
    });
  }
}

export class GameModule {
  createNewCharacter() {
    let operations = [
      new EarnResourceForPlayerOperation({
        time: time,
        resources: [new CityResource(CityResource.kResourceWood, 1)],
      }),
      new InvestResourceInBuildingOperation({
        time: time,
      })
    ];
    let character = new CityCharacter({
      operations:operations
    });
    return character;
  }
  availableBuildings() {
    return GameModule.availableBuildings;
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

GameModule.availableBuildings = {};
GameModule.availableBuildings[GameModule.kFarm.id] = GameModule.kFarm;
