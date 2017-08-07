const assert = require('chai').assert;
const GameController = require("../lib/controller/GameController.js").default;
const GameModule = require('../lib/module/GameModule.js').default;
const CityEvent = require('../lib/city/CityEvent.js').default;
const CityResource = require('../lib/city/CityResource.js').CityResource;

describe('Game Controller', () => {

  it('Can plan or install buildings', () => {
    let controller = new GameController();
    controller.startNewGame();
    let fieldEvent = controller.planBuilding(GameModule.kBananaField.id);
    let caveEvents = controller.installCompletedBuilding(GameModule.kCave.id);
    
    let field = controller.player.city.buildings[fieldEvent.object.id];
    let cave = controller.player.city.buildings[caveEvents[0].object.id];
    assert.isFalse(field.isCompleted());
    assert.isTrue(cave.isCompleted());
  });

  it('Generate Resources', () => {
    let controller = new GameController();
    controller.startNewGame();
    
    /* Let's add a building */
    let events = controller.installCompletedBuilding(GameModule.kBananaField.id);
    
    /* Let's force it complete */
    let buildingId = events[0].object.id;
    let building = controller.player.city.buildings[buildingId];
    building.costs = [];
    building.isCompleted();
    
    let sentGrantResourceEvents = [];
    controller.on(CityEvent.kEarnResourceEvent, (e) => {
      sentGrantResourceEvents.push(e);
    });
    let sentStoreResourceEvents = [];
    controller.on(CityEvent.kStoreResourceEvent, (e) => {
      sentStoreResourceEvents.push(e);
    });
    
    /* Producing food by a farm takes 5. Don't expect anything done on 5: */
    let events1 = controller.tick(1);
    assert.isFalse(controller.player.canAfford([GameModule.banana(1)]));
    let tickedResourceEvents1 = events1.filter(e => e.type == CityEvent.kEarnResourceEvent);
    assert.strictEqual(sentGrantResourceEvents.length, 0);
    assert.strictEqual(sentStoreResourceEvents.length, 0);
    assert.strictEqual(tickedResourceEvents1.length, 0);
    
    /* Producing food by a farm takes 5. Expect food on 6: */
    let events2 = controller.tick(5);
    assert.strictEqual(sentStoreResourceEvents.length, 1);
    assert.strictEqual(sentGrantResourceEvents.length, 0);
    building.collectResources(controller.player);
    assert.isTrue(controller.player.canAfford([GameModule.banana(1)]));
    let tickedResourceEvents2 = events2.filter(e => e.type == CityEvent.kEarnResourceEvent);
    assert.strictEqual(sentStoreResourceEvents.length, 1);
    
    /* Need to allows collects to send events: */
    // assert.strictEqual(sentGrantResourceEvents.length, 1);
    // assert.strictEqual(tickedResourceEvents2.length, 1);
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

  it('JSON interface', () => {
    let controller = new GameController();
    controller.startNewGame();
    let id = Object.keys(controller.module.availableBuildings())[0];
    let buildingTemplate = controller.module.availableBuildings()[id];

    controller.planBuilding(id, -1, -1);

    let newBuildingId = Object.keys(controller.getAllMyBuilding())[0];
    let building = controller.getBuilding(newBuildingId);

    assert.equal(buildingTemplate.name, building.name);
  });
});
