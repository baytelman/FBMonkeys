const assert = require('chai').assert;
const GameController = require("../lib/controller/GameController.js").default;
const GameModule = require('../lib/module/GameModule.js').default;
const CityEvent = require('../lib/city/CityEvent.js').CityEvent;
const CityResource = require('../lib/city/CityResource.js').CityResource;

describe('Game Controller', () => {
  it('Can plan or install buildings', () => {
    let controller = new GameController();
    controller.startNewGame();
    let farmEvent = controller.planBuilding(GameModule.kFarm.id);
    let woodmillEvents = controller.installCompletedBuilding(GameModule.kLumberMill.id);
    
    let farm = controller.player.city.buildings[farmEvent.object.id];
    let woodMill = controller.player.city.buildings[woodmillEvents[0].object.id];
    assert.isFalse(farm.isCompleted());
    assert.isTrue(woodMill.isCompleted());
  });

  it('Generate Resources', () => {
    let controller = new GameController();
    controller.startNewGame();
    
    /* Let's add a building */
    let events = controller.installCompletedBuilding(GameModule.kFarm.id);
    
    /* Let's force it complete */
    let buildingId = events[0].object.id;
    let building = controller.player.city.buildings[buildingId];
    building.costs = [];
    building.isCompleted();
    
    let sentResourceEvents = [];
    controller.on(CityEvent.kEarnResourceEvent, (e) => {
      sentResourceEvents.push(e);
    });
    
    /* Producing food by a farm takes 50. Don't expect anything done on 5: */
    let events1 = controller.tick(5);
    assert.isFalse(controller.player.canAfford([CityResource.food(1)]));
    let tickedResourceEvents1 = events1.filter(e => e.type == CityEvent.kEarnResourceEvent);
    assert.strictEqual(sentResourceEvents.length, 0);
    assert.strictEqual(tickedResourceEvents1.length, 0);
    
    /* Producing food by a farm takes 50. Expect food on 55: */
    let events2 = controller.tick(50);
    assert.isTrue(controller.player.canAfford([CityResource.food(1)]));
    let tickedResourceEvents2 = events2.filter(e => e.type == CityEvent.kEarnResourceEvent);
    assert.strictEqual(sentResourceEvents.length, 1);
    assert.strictEqual(tickedResourceEvents2.length, 1);
  });
  
  it('Can Place Buildings', () => {
    let controller = new GameController();
    controller.startNewGame();
    
    let called = false;
    controller.on(CityEvent.kBuildingPlannedEvent, () => {
      called = true;
    });
    
    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 0);
    assert.isFalse(called);
    
    let id = Object.keys(controller.module.availableBuildings())[0];
    controller.planBuilding(id, -1, -1);
    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 1);
    assert.isTrue(called);
  });
});
