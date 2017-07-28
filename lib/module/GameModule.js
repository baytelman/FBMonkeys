import values from 'object.values';
if (!Object.values) {
    values.shim();
}

import {Building} from '../city/Building';
import {CityResource} from '../city/CityResource';
import {PlayerEarnResourceEffect, CapacityGrantingEffect} from '../city/CityPlayer';

export default class GameModule {
  constructor() {}
  availableBuildings() {
    return GameModule.kAvailableBuildings;
  }

  static gold(amount) {
    return new CityResource(GameModule.kResourceGold, amount);
  }
  static wood(amount) {
    return new CityResource(GameModule.kResourceWood, amount);
  }
  static food(amount) {
    return new CityResource(GameModule.kResourceFood, amount);
  }
  getPlayerInitialCapacity() {
    return {
      [GameModule.kResourceGold]: 50,
      [GameModule.kResourceFood]: 5,
      [GameModule.kResourceWood]: 100
    }
  }
}

GameModule.kResourceGold = 'gold';
GameModule.kResourceFood = 'food';
GameModule.kResourceWood = 'wood';

GameModule.kCityHall = new Building({
  name: "City Hall",
  namespace: "building.basic.city_hall",
  time: 50,
  costs: [GameModule.gold(9999)]
});

GameModule.kGoldMine = new Building({
  name: "Gold Mine",
  namespace: "building.basic.gold_mine",
  time: 50,
  costs: [GameModule.gold(100)],
  effects: [new PlayerEarnResourceEffect({
      resources: [GameModule.gold(1)],
      frequency: 10
    })]
});

GameModule.kFarm = new Building({
  name: "Farm",
  namespace: "building.basic.farm",
  time: 30,
  costs: [
    GameModule.gold(10),
    GameModule.wood(10)
  ],
  effects: [new PlayerEarnResourceEffect({
      resources: [GameModule.food(1)],
      frequency: 50
    })]
});

GameModule.kGranary = new Building({
  name: "Granary",
  namespace: "building.basic.granary",
  time: 30,
  costs: [
    GameModule.gold(10),
    GameModule.wood(10)
  ],
  requirements: ["building.basic.farm"],
  permanentEffects: [new CapacityGrantingEffect({
      [GameModule.kResourceFood]: 50
    })]
});

GameModule.kLumberMill = new Building({
  name: "Lumber Mill",
  namespace: "building.basic.lumber_mill",
  time: 25,
  costs: [GameModule.wood(30)],
  effects: [new PlayerEarnResourceEffect({
      resources: [GameModule.wood(1)],
      frequency: 3
    })],
  permanentEffects: []
});

GameModule.kAvailableBuildings = {};
Object
  .values(GameModule)
  .forEach(value => {
    if (value instanceof Building) {
      GameModule.kAvailableBuildings[value.id] = value;
    }
  });
GameModule.kDefaultBuildings = [GameModule.kCityHall.id]