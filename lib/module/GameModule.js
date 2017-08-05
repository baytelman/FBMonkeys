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
  static banana(amount) {
    return new CityResource(GameModule.kResourceBanana, amount);
  }
  getPlayerInitialCapacity() {
    return {
      [GameModule.kResourceGold]: 50,
      [GameModule.kResourceBanana]: 50,
      [GameModule.kResourceWood]: 100
    }
  }
}

GameModule.kResourceGold = 'gold';
GameModule.kResourceBanana = 'banana';
GameModule.kResourceMonkey = 'monkey';
GameModule.kResourceWood = 'wood';

GameModule.kBananaTree = new Building({
  name: "Central Banana Tree",
  namespace: "building.basic.banana_tree",
  time: 50,
  costs: [GameModule.wood(9999)],
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [GameModule.kResourceMonkey]: 1
    }
  })]
});

GameModule.kCave = new Building({
  name: "Cave",
  namespace: "building.basic.cave",
  time: 50,
  costs: [GameModule.wood(50)],
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [GameModule.kResourceMonkey]: 1
    }
  })]
});

GameModule.kBananaField = new Building({
  name: "Banana Field",
  namespace: "building.basic.banana_field",
  time: 50,
  costs: [GameModule.banana(50)],
  costFactor: 2,
  effects: [new PlayerEarnResourceEffect({
    resources: [GameModule.banana(5), GameModule.wood(1)],
    frequency: 5
  })]
});

GameModule.kBananaCrate = new Building({
  name: "Banana Crate",
  namespace: "building.basic.banana_crate",
  time: 30,
  costs: [
    GameModule.wood(10)
  ],
  requirements: ["building.basic.banana_field"],
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [GameModule.kResourceBanana]: 100
    }
  })]
});

GameModule.kAvailableBuildings = {};
Object
.values(GameModule)
.forEach(value => {
  if (value instanceof Building) {
    GameModule.kAvailableBuildings[value.id] = value;
  }
});
GameModule.kDefaultBuildings = [GameModule.kBananaTree.id]