import values from 'object.values';
if (!Object.values) {
  values.shim();
}

import {Building, BuildingStoreResourceEffect, CollectBuildingResourcesEffect} from '../city/Building';
import {CityResource} from '../city/CityResource';
import {PlayerEarnResourceEffect, CapacityGrantingEffect} from '../city/CityPlayer';
import {CityCharacter, CharacterConsumeResourceOrGetsRemovedEffect} from '../city/CityCharacter';

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
  'Langur'
];

const randomElement = (list) => list[Math.floor(Math.random() * list.length)]
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
  getSeasonPeriod() {
    return 60;
  }
  getSeasonAffectedResource() {
    return GameModule.kResourceBanana;
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
      monkey: {
        requirements: [[GameModule.kResourceBanana, 5]],
        factory: () => {
          let char = new CityCharacter({
            effects: [new CharacterConsumeResourceOrGetsRemovedEffect({
                resources: [GameModule.banana(1)],
                period: 1
              })],
            name: nameGenerator()
          });
          char.tasks = [new CollectBuildingResourcesEffect({time: 1})];
          return char;
        }
      }
    };
  }
}

GameModule.kResourceStone = 'stone';
GameModule.kResourceBanana = 'banana';
GameModule.kResourceMonkey = 'monkey';
GameModule.kResourceWood = 'wood';

GameModule.kBananaTree = new Building({
  name: "Central Banana Tree",
  requirements: ["never"],
  namespace: "building.basic.banana_tree",
  time: 50,
  costs: [GameModule.wood(9999)],
  effects: [
    new BuildingStoreResourceEffect({
      resources: [GameModule.banana(1)],
      period: 2
    }),
    new PlayerEarnResourceEffect({
      resources: [GameModule.monkey(1)],
      period: 5
    })
  ]
});

GameModule.kCabin = new Building({
  name: "Cabin",
  namespace: "building.basic.cabin",
  requirements: ["building.basic.banana_crate"],
  time: 10,
  costs: [GameModule.wood(5)],
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
  costs: [GameModule.banana(5)],
  effects: [
    new BuildingStoreResourceEffect({
      resources: [
        GameModule.banana(7),
        GameModule.wood(1)
      ],
      period: 2
    }),
    new PlayerEarnResourceEffect({
      resources: [GameModule.banana(1)],
      period: 3
    })],
  requirements: [
    [GameModule.kResourceBanana, 2]
  ]
});

GameModule.kWoodField = new Building({
  name: "Wood Field",
  namespace: "building.basic.wood_field",
  time: 10,
  costs: [GameModule.banana(25)],
  effects: [new BuildingStoreResourceEffect({
      resources: [GameModule.wood(10)],
      period: 4
    })],
  requirements: [
    [GameModule.kResourceWood, 5]
  ]
});

GameModule.kBananaCrate = new Building({
  name: "Banana Crate",
  namespace: "building.basic.banana_crate",
  time: 5,
  costs: [GameModule.wood(5)],
  requirements: [
    "building.basic.banana_field",
    [GameModule.kResourceWood, 3]
  ],
  permanentEffects: [new CapacityGrantingEffect({
      additions: {
        [GameModule.kResourceBanana]: 50
      }
    })]
});

GameModule.kSawmill = new Building({
  name: "Sawmill",
  namespace: "building.basic.sawmill",
  time: 5,
  costs: [GameModule.wood(20)],
  costFactor: 1.5,
  requirements: [
    "building.basic.banana_crate",
    [GameModule.kResourceWood, 15]
  ],
  permanentEffects: [new CapacityGrantingEffect({
      additions: {
        [GameModule.kResourceWood]: 100
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