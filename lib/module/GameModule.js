
const Building = require('../city/Building.js').Building;
const CityResource = require('../city/CityResource.js').CityResource;
const PlayerEarnResourceEffect = require("../city/CityPlayer.js").PlayerEarnResourceEffect;

export default class GameModule {
  constructor() {
  }
  availableBuildings() {
    return GameModule.kAvailableBuildings;
  }
}

GameModule.kCityHall = new Building({
  name: "City Hall",
  asset: "city_hall",
  time: 50,
  costs: [CityResource.gold(9999)]
});

GameModule.kGoldMine = new Building({
  name: "Gold Mine",
  asset: "gold_mine",
  time: 50,
  costs: [CityResource.gold(100)],
  effects: [new PlayerEarnResourceEffect({
    resources:[CityResource.gold(1)],
    frequency: 10
  })]
});

GameModule.kFarm = new Building({
  name: "Farm",
  asset: "farm",
  time: 30,
  costs: [
    CityResource.gold(10),
    CityResource.wood(10),
  ],
  effects: [new PlayerEarnResourceEffect({
    resources: [CityResource.food(1)],
    frequency: 50
  })]
});

GameModule.kLumberMill = new Building({
  name: "Lumber Mill",
  asset: "lumber_mill",
  time: 25,
  costs: [CityResource.wood(30)],
  effects: [new PlayerEarnResourceEffect({
    resources:[CityResource.wood(1)],
    frequency: 3
  })]
});

GameModule.kAvailableBuildings = {};
GameModule.kAvailableBuildings[GameModule.kFarm.id] = GameModule.kFarm;
GameModule.kAvailableBuildings[GameModule.kCityHall.id] = GameModule.kCityHall;
GameModule.kAvailableBuildings[GameModule.kLumberMill.id] = GameModule.kLumberMill;
GameModule.kAvailableBuildings[GameModule.kGoldMine.id] = GameModule.kGoldMine;

GameModule.kDefaultBuildings = [GameModule.kCityHall.id]