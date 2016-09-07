var CitySerializer = require("../city/CitySerializer.js").CitySerializer;
var CityPlayer = require('../city/CityPlayer.js').CityPlayer;
var CharacterOperationJS = require("../city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var BuildingJS = require('../city/Building.js');
var Building = BuildingJS.Building;
var CityResource = require('../city/CityResource.js').CityResource;
var PlayerEarnResourceEffect = require("../city/CityPlayer.js").PlayerEarnResourceEffect;

export class GameController {
  constructor() {
    this.module = GameModule();
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
}

export class GameModule {
  constructor() {
  }
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
