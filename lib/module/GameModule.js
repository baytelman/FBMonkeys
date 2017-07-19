
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
  namespace: "building.basic.city_hall",
  time: 50,
  costs: [CityResource.gold(9999)]
});

GameModule.kGoldMine = new Building({
  name: "Gold Mine",
  namespace: "building.basic.gold_mine",
  time: 50,
  costs: [CityResource.gold(100)],
  effects: [new PlayerEarnResourceEffect({
    resources:[CityResource.gold(1)],
    frequency: 10
  })]
});

GameModule.kFarm = new Building({
  name: "Farm",
  namespace: "building.basic.farm",
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

GameModule.kGranary = new Building({
  name: "Granary",
  namespace: "building.basic.granary",
  time: 30,
  costs: [
    CityResource.gold(10),
    CityResource.wood(10),
  ],
  requirements: ["building.basic.farm"],
});

GameModule.kLumberMill = new Building({
  name: "Lumber Mill",
  namespace: "building.basic.lumber_mill",
  time: 25,
  costs: [CityResource.wood(30)],
  effects: [new PlayerEarnResourceEffect({
    resources:[CityResource.wood(1)],
    frequency: 3
  })]
});

GameModule.kAvailableBuildings = {};
Object.values(GameModule).forEach(value => {
  if (value instanceof Building) {
    GameModule.kAvailableBuildings[value.id] = value;
  }
});
GameModule.kDefaultBuildings = [GameModule.kCityHall.id]