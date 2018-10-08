import { assert } from 'chai';

import GameController from '../controller/GameController';
import GameModule, { banana, wood } from '../controller/GameModule';
import {
  kEarnResourceEvent,
  kStoreResourceEvent,
  kBuildingPlannedEvent,
  kPeriodicEffectProgressEvent
} from '../controller/CityEvent';

describe('Game Controller', () => {
  it('Can plan or install buildings', () => {
    let controller = new GameController();
    controller.startNewGame({ defaultBuildings: [] });
    let fieldEvents = controller.planBuildingWithoutResouceConsumption({
      namespace: GameModule.kBananaField.namespace
    });
    let caveEvents = controller.installCompletedBuilding(
      GameModule.kCabin.namespace
    );

    let field = controller.player.city.buildings[fieldEvents[0].object.id];
    let cave = controller.player.city.buildings[caveEvents[0].object.id];
    assert.isFalse(field.isCompleted());
    assert.isTrue(cave.isCompleted());
  });

  it('Generate Resources', () => {
    let controller = new GameController();
    controller.startNewGame({ defaultBuildings: [] });

    /* Let's add a building */
    let events = controller.installCompletedBuilding(
      GameModule.kBananaField.namespace
    );

    /* Let's force it complete */
    let buildingId = events[0].object.id;
    let building = controller.player.city.buildings[buildingId];
    building.cost = [];
    building.isCompleted();

    /* Producing food by a farm takes 5. Don't expect anything done on 5: */
    let events1 = controller.updateTime(1);
    assert.isFalse(controller.player.canAfford([banana(1)]));
    assert.strictEqual(
      events1.filter(e => e.type === kEarnResourceEvent).length,
      0
    );
    assert.strictEqual(
      events1.filter(e => e.type === kStoreResourceEvent).length,
      0
    );
    assert.strictEqual(
      events1.filter(e => e.type === kEarnResourceEvent).length,
      0
    );

    /* Producing food by a farm takes 5. Expect food on 6: */
    let events2 = controller.updateTime(30);
    assert.strictEqual(
      events2.filter(e => e.type === kStoreResourceEvent).length,
      1 /* Banana fields store 7 banana every 2, but it becomes blocked until gathered */
    );
    assert.strictEqual(
      events2.filter(e => e.type === kEarnResourceEvent).length,
      1 /* Banana fields grant 1 banana every 30 */
    );

    let events3 = controller.collectFromBuilding(
      buildingId
    ); /* One more grant, from collect */
    assert.strictEqual(
      events3.filter(e => e.type === kEarnResourceEvent).length,
      1
    );
  });

  it('Can Place Buildings', () => {
    let called = false;
    let controller = new GameController({
      onUpdate: events =>
        events.forEach(event => {
          switch (event.type) {
            case kBuildingPlannedEvent:
              called = true;
              break;
          }
        })
    });
    controller.startNewGame({ defaultBuildings: [] });

    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 0);
    assert.isFalse(called);

    let namespace = Object.keys(controller.module.allBuildings())[0];
    controller.planBuildingWithoutResouceConsumption({ namespace });
    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 1);
    assert.isTrue(called);
  });

  it('Can Assign Roles', () => {
    let controller = new GameController();
    controller.startNewGame({ defaultBuildings: [] });

    /* Let's ensure we have enough bananas for the 2 monkeys */
    controller.installCompletedBuilding(GameModule.kBananaTree.namespace);
    controller.installCompletedBuilding(GameModule.kCrate.namespace);
    controller.installCompletedBuilding(GameModule.kBananaField.namespace);
    controller.installCompletedBuilding(GameModule.kBananaField.namespace);

    /* Let's get 2 monkeys */
    controller.installCompletedBuilding(GameModule.kCabin.namespace);
    controller.installCompletedBuilding(GameModule.kCabin.namespace);

    /* Let's get a lot of resources */
    controller.player.earnResources([banana(100), wood(100)]);

    /* I should have 1 monkey */
    const events = controller.updateTime(9);
    assert.strictEqual(
      Object.values(controller.player.city.characters).length,
      1
    );
    let monkey1 = Object.values(controller.player.city.characters)[0];
    controller.setCharacterTasks(monkey1.id, [
      GameModule.kTaskGather.namespace
    ]);

    controller.scheduleResearch(GameModule.kMining.namespace);
    assert.strictEqual(
      Object.values(controller.player.researchProjects).length,
      1
    );

    controller.updateTime(20);
    assert.strictEqual(
      Object.values(controller.player.city.characters).length,
      2
    );
    let monkey2 = Object.values(controller.player.city.characters)[1];
    controller.setCharacterTasks(monkey2.id, [
      GameModule.kTaskResearch.namespace
    ]);

    /* Let's finish that research */
    controller.updateTime(100);
    assert.strictEqual(
      Object.values(controller.player.researchProjects).length,
      0
    );
    assert.strictEqual(
      Object.values(controller.player.researchedProjects).length,
      1
    );
  });

  it('JSON interface', () => {
    let controller = new GameController();
    controller.startNewGame({ defaultBuildings: [] });

    let namespace = Object.keys(controller.module.allBuildings())[0];
    let buildingTemplate = controller.module.allBuildings()[namespace];

    controller.planBuildingWithoutResouceConsumption({ namespace });

    let newBuildingId = Object.keys(controller.getAllMyBuilding())[0];
    let building = controller.getBuilding(newBuildingId);

    assert.equal(buildingTemplate.name, building.name);
  });
});
