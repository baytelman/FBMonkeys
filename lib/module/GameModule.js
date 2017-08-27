import values from 'object.values';
if (!Object.values) {
  values.shim();
}

import {CityResource} from '../city/CityResource';
import {PlayerEarnResourceEffect, CapacityGrantingEffect} from '../city/CityPlayer';
import CityCharacter, {CharacterConsumeResourceOrGetsRemovedEffect} from '../city/CityCharacter';
import {FrequencyEffect} from '../city/Effect';

import CityBuilding, {BuildingStoreResourceEffect, CollectBuildingResourcesEffect} from '../city/CityBuilding';
import CityResearchProject, {PlayerEarnResearchEffect} from '../city/CityResearchProject';

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
  allBuildings() {
    return GameModule.kAvailableBuildings;
  }
  allResearch() {
    return GameModule.kAvailableResearch;
  }
  availableTasks() {
    return GameModule.kAvailableTasks;
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
      [GameModule.kResourceBanana]: 25,
      [GameModule.kResourceWood]: 20
    }
  }
  getCharacterFactories() {
    return {
      monkey: {
        requirements: [
          [GameModule.kResourceBanana, 5]
        ],
        factory: () => {
          let char = new CityCharacter({
            effects: [new CharacterConsumeResourceOrGetsRemovedEffect({
                resources: [GameModule.banana(1)],
                period: 1
              })],
            name: nameGenerator()
          });
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

/* ROLES */

GameModule.kTaskGather = new CollectBuildingResourcesEffect({
  name: 'Gather',
  namespace: 'role.basic.gather',
  time: 1
});

GameModule.kTaskResearch = new PlayerEarnResearchEffect({
  name: 'Research',
  namespace: 'role.basic.research',
  time: 1
});

/* BUILDINGS */

GameModule.kBananaTree = new CityBuilding({
  name: "Central Banana Tree",
  requirements: ["never"],
  namespace: "building.basic.banana_tree",
  time: 50,
  cost: [GameModule.wood(9999)],
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

GameModule.kCabin = new CityBuilding({
  name: "Cabin",
  namespace: "building.basic.cabin",
  requirements: ["building.basic.banana_crate"],
  time: 10,
  cost: [GameModule.wood(5)],
  permanentEffects: [new CapacityGrantingEffect({
      additions: {
        [GameModule.kResourceMonkey]: 1
      }
    })]
});

GameModule.kBananaField = new CityBuilding({
  name: "Banana Field",
  namespace: "building.basic.banana_field",
  time: 10,
  cost: [GameModule.banana(5)],
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
    })
  ],
  requirements: [
    [GameModule.kResourceBanana, 2]
  ]
});

GameModule.kWoodField = new CityBuilding({
  name: "Wood Field",
  namespace: "building.basic.wood_field",
  time: 10,
  cost: [GameModule.banana(25)],
  effects: [new BuildingStoreResourceEffect({
      resources: [GameModule.wood(10)],
      period: 4
    })],
  requirements: [
    [GameModule.kResourceWood, 5]
  ]
});

GameModule.kBananaCrate = new CityBuilding({
  name: "Banana Crate",
  namespace: "building.basic.banana_crate",
  time: 5,
  cost: [GameModule.wood(5)],
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

GameModule.kSawmill = new CityBuilding({
  name: "Sawmill",
  namespace: "building.basic.sawmill",
  time: 5,
  cost: [GameModule.wood(20)],
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

GameModule.kMine = new CityBuilding({
  name: "Mine",
  namespace: "building.basic.sawmill",
  time: 5,
  cost: [GameModule.wood(20)],
  costFactor: 1.5,
  requirements: ["research.basic.digging"]
});

/* RESEARCH */

GameModule.kDigging = new CityResearchProject({
  name: "Digging",
  namespace: "research.basic.digging",
  time: 5,
  cost: [GameModule.wood(20)],
  requirements: [
    [GameModule.kResourceMonkey, 1]
  ]
});

/* LOADER */

GameModule.kAvailableTasks = {};
Object
  .values(GameModule)
  .forEach(value => {
    if (value instanceof FrequencyEffect) {
      GameModule.kAvailableTasks[value.namespace] = value;
    }
  });

GameModule.kAvailableBuildings = {};
Object
  .values(GameModule)
  .forEach(value => {
    if (value instanceof CityBuilding) {
      GameModule.kAvailableBuildings[value.namespace] = value;
    }
  });

GameModule.kAvailableResearch = {};
Object
  .values(GameModule)
  .forEach(value => {
    if (value instanceof CityResearchProject) {
      GameModule.kAvailableResearch[value.namespace] = value;
    }
  });

GameModule.kDefaultBuildings = [GameModule.kBananaTree.namespace]