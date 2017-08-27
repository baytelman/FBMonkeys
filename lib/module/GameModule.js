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
  getSeasonPeriod() {
    return 60;
  }
  getSeasonAffectedResource() {
    return GameModule.kResourceBanana;
  }
  getPlayerInitialCapacity() {
    return {
      [GameModule.kResourceBanana]: 25,
      [GameModule.kResourceWood]: 20,
      [GameModule.kResourceRock]: 20,
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
                resources: [banana(1)],
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

GameModule.kResourceRock = 'rock';
GameModule.kResourceBanana = 'banana';
GameModule.kResourceMonkey = 'monkey';
GameModule.kResourceWood = 'wood';

export function wood(amount) {
  return new CityResource(GameModule.kResourceWood, amount);
}
export function banana(amount) {
  return new CityResource(GameModule.kResourceBanana, amount);
}
export function monkey(amount) {
  return new CityResource(GameModule.kResourceMonkey, amount);
}
export function rock(amount) {
  return new CityResource(GameModule.kResourceRock, amount);
}

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
  cost: [wood(9999)],
  effects: [
    new BuildingStoreResourceEffect({
      resources: [banana(1)],
      period: 2
    }),
    new PlayerEarnResourceEffect({
      resources: [monkey(1)],
      period: 5
    })
  ]
});

GameModule.kBananaField = new CityBuilding({
  name: "Banana Field",
  namespace: "building.basic.banana_field",
  time: 10,
  cost: [banana(5)],
  effects: [
    new BuildingStoreResourceEffect({
      resources: [
        banana(7),
        wood(1)
      ],
      period: 2
    }),
    new PlayerEarnResourceEffect({
      resources: [banana(1)],
      period: 3
    })
  ],
  requirements: [
    [GameModule.kResourceBanana, 2]
  ]
});

GameModule.kCrate = new CityBuilding({
  name: "Crate",
  namespace: "building.basic.crate",
  time: 5,
  cost: [wood(5)],
  requirements: [
    GameModule.kBananaField.namespace,
    [GameModule.kResourceWood, 3]
  ],
  permanentEffects: [new CapacityGrantingEffect({
      additions: {
        [GameModule.kResourceBanana]: 50,
        [GameModule.kResourceWood]: 10,
        [GameModule.kResourceRock]: 10
      }
    })]
});

GameModule.kCabin = new CityBuilding({
  name: "Cabin",
  namespace: "building.basic.cabin",
  requirements: ["building.basic.crate"],
  time: 10,
  cost: [wood(5)],
  permanentEffects: [new CapacityGrantingEffect({
      additions: {
        [GameModule.kResourceMonkey]: 1
      }
    })]
});

GameModule.kWoodField = new CityBuilding({
  name: "Wood Field",
  namespace: "building.basic.wood_field",
  time: 10,
  cost: [banana(25)],
  effects: [new BuildingStoreResourceEffect({
      resources: [wood(10)],
      period: 4
    })],
  requirements: [
    "research.basic.agriculture",
    [GameModule.kResourceWood, 5]
  ]
});

GameModule.kSawmill = new CityBuilding({
  name: "Sawmill",
  namespace: "building.basic.sawmill",
  time: 5,
  cost: [wood(20)],
  costFactor: 1.5,
  requirements: [
    "building.basic.crate",
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
  namespace: "building.basic.mine",
  time: 5,
  cost: [wood(20)],
  costFactor: 1.5,
  requirements: ["research.basic.mining"],
  effects: [new BuildingStoreResourceEffect({
      resources: [rock(2)],
      period: 1
    })],
});

GameModule.kForge = new CityBuilding({
  name: "Forge",
  namespace: "building.basic.forge",
  time: 5,
  cost: [wood(50), rock(50)],
  costFactor: 1.5,
  requirements: ["research.basic.metal_casting"],
  effects: [new BuildingStoreResourceEffect({
      resources: [rock(2)],
      period: 1
    })],
});

/* RESEARCH */

GameModule.kCalendar = new CityResearchProject({
  name: "Calendar",
  namespace: "research.basic.calendar",
  time: 15,
  requirements: [
    [GameModule.kResourceMonkey, 2]
  ]
});

GameModule.kAgriculture = new CityResearchProject({
  name: "Agriculture",
  namespace: "research.basic.agriculture",
  time: 40,
  requirements: [
    "research.basic.calendar"
  ]
});

GameModule.kMining = new CityResearchProject({
  name: "Mining",
  namespace: "research.basic.mining",
  time: 20,
  cost: [wood(20)],
  requirements: [
    "research.basic.agriculture"
  ]
});

GameModule.kMetalCasting = new CityResearchProject({
  name: "Metal casting",
  namespace: "research.basic.metal_casting",
  time: 20,
  cost: [wood(30), rock(50)],
  requirements: [
    "research.basic.mining",
    [GameModule.kResourceRock, 20]
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

GameModule.kDefaultBuildings = [
  GameModule.kBananaTree.namespace,
  // GameModule.kBananaField.namespace,
  // GameModule.kBananaField.namespace,
  // GameModule.kWoodField.namespace,
  // GameModule.kWoodField.namespace,
  // GameModule.kCrate.namespace,
  // GameModule.kCrate.namespace,
  // GameModule.kSawmill.namespace,
  // GameModule.kCabin.namespace,
  // GameModule.kCabin.namespace,
  // GameModule.kBananaTree.namespace,
];
