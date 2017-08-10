import values from 'object.values';
if (!Object.values) {
    values.shim();
}

import {Building} from '../city/Building';
import {CityResource} from '../city/CityResource';
import {PlayerEarnResourceEffect, BuildingStoreResourceEffect, CapacityGrantingEffect} from '../city/CityPlayer';
import {CityCharacter} from '../city/CityCharacter';

const MONKEY_GIVEN_NAMES = [
'Heather', 
'Iris',
'Juniper',
'Laurel',
'Blossom',
'Jasper',

'Forrest',
'Haven',
'Jay',
'Kodiak',
'Leaf',
'Rowan'
];


const MONKEY_SUR_NAMES = [
'Affin',
'Apa',
'Apina',
'Gibbons',
'Macaque',
'Monyet',
'Saki',
'Tamarin',
'Simia',
'Langur',
];

const randomElement = (list) => list[Math.floor(Math.random()*list.length)]
const nameGenerator = () => randomElement(MONKEY_SUR_NAMES) + ', ' + randomElement(MONKEY_GIVEN_NAMES);

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
  static monkey(amount) {
    return new CityResource(GameModule.kResourceMonkey, amount);
  }
  getPlayerInitialCapacity() {
    return {
      [GameModule.kResourceGold]: 50,
      [GameModule.kResourceBanana]: 25,
      [GameModule.kResourceWood]: 20
    }
  }
  getCharacterFactories() {
    return {
      monkey: () => new CityCharacter({name: nameGenerator()})
    };
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
  effects: [new BuildingStoreResourceEffect({
    resources: [GameModule.banana(1)],
    frequency: 2
  }), new PlayerEarnResourceEffect({
    resources: [GameModule.monkey(1)],
    frequency: 30
  })]
});

GameModule.kCave = new Building({
  name: "Cave",
  namespace: "building.basic.cave",
  time: 10,
  costs: [GameModule.wood(15)],
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [GameModule.kResourceMonkey]: 1
    }
  })]
});

GameModule.kBananaField = new Building({
  name: "Banana Field",
  namespace: "building.basic.banana_field",
  time: 10,
  costs: [GameModule.banana(10)],
  costFactor: 2,
  effects: [new BuildingStoreResourceEffect({
    resources: [GameModule.banana(5), GameModule.wood(1)],
    frequency: 2
  })]
});

GameModule.kBananaCrate = new Building({
  name: "Banana Crate",
  namespace: "building.basic.banana_crate",
  time: 5,
  costs: [
    GameModule.wood(10)
  ],
  requirements: ["building.basic.banana_field"],
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [GameModule.kResourceBanana]: 50
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