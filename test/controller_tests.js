const assert = require('chai').assert;
const GameController = require("../lib/controller/GameController.js").default;
const GameModule = require('../lib/module/GameModule.js').default;
const CityEvent = require('../lib/city/CityEvent.js').default;
const CityResource = require('../lib/city/CityResource.js').CityResource;

describe('Game Controller', () => {

  it('Can plan or install buildings', () => {
    let controller = new GameController();
    controller.startNewGame();
    let fieldEvent = controller.planBuilding(GameModule.kBananaField.namespace);
    let caveEvents = controller.installCompletedBuilding(GameModule.kCabin.namespace);
    
    let field = controller.player.city.buildings[fieldEvent.object.id];
    let cave = controller.player.city.buildings[caveEvents[0].object.id];
    assert.isFalse(field.isCompleted());
    assert.isTrue(cave.isCompleted());
  });

  it('Generate Resources', () => {
    let controller = new GameController();
    controller.startNewGame();
    
    /* Let's add a building */
    let events = controller.installCompletedBuilding(GameModule.kBananaField.namespace);
    
    /* Let's force it complete */
    let buildingId = events[0].object.id;
    let building = controller.player.city.buildings[buildingId];
    building.cost = [];
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
    assert.isFalse(controller.player.canAfford([banana(1)]));
    let tickedResourceEvents1 = events1.filter(e => e.type == CityEvent.kEarnResourceEvent);
    assert.strictEqual(sentGrantResourceEvents.length, 0);
    assert.strictEqual(sentStoreResourceEvents.length, 0);
    assert.strictEqual(tickedResourceEvents1.length, 0);
    
    /* Producing food by a farm takes 5. Expect food on 6: */
    controller.tick(5);
    assert.strictEqual(sentStoreResourceEvents.length, 1); /* Banana fields store 7 banana every 2 */
    assert.strictEqual(sentGrantResourceEvents.length, 2); /* Banana fields grant 1 banana every 3 */

    let event = controller.collectFromBuilding(buildingId); /* One more grant, from collect */
    assert.strictEqual(sentStoreResourceEvents.length, 1);
    
    /* Need to allows collects to send events: */
    assert.strictEqual(sentGrantResourceEvents.length, 3);
    assert.strictEqual(event.type, CityEvent.kEarnResourceEvent);
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
    
    let id = Object.keys(controller.module.allBuildings())[0];
    controller.planBuilding(id);
    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 1);
    assert.isTrue(called);
  });
  
  it('Can Assign Roles', () => {
    let controller = new GameController();
    controller.startNewGame();
    /* Let's ensure we have enough bananas for the 2 monkeys */
    controller.installCompletedBuilding(GameModule.kBananaTree.namespace);
    controller.installCompletedBuilding(GameModule.kBananaCrate.namespace);
    controller.installCompletedBuilding(GameModule.kBananaField.namespace);
    controller.installCompletedBuilding(GameModule.kBananaField.namespace);
    /* Let's get 2 monkeys */
    controller.installCompletedBuilding(GameModule.kCabin.namespace);
    controller.installCompletedBuilding(GameModule.kCabin.namespace);

    /* I should have 1 monkey */
    controller.tick(9);
    assert.strictEqual(Object.values(controller.player.city.characters).length, 1);
    let monkey1 = Object.values(controller.player.city.characters)[0];
    controller.setCharacterTasks(monkey1.id, [GameModule.kTaskGather.namespace]);

    controller.scheduleResearch(GameModule.kDigging.namespace);
    assert.strictEqual(Object.values(controller.player.researchProjects).length, 1);
    
    controller.tick(20);
    assert.strictEqual(Object.values(controller.player.city.characters).length, 2);
    let monkey2 = Object.values(controller.player.city.characters)[1];
    controller.setCharacterTasks(monkey2.id, [GameModule.kTaskResearch.namespace]);
    
    /* Let's finish that research */
    controller.tick(100);
    assert.strictEqual(Object.values(controller.player.researchProjects).length, 0);
    assert.strictEqual(Object.values(controller.player.researchedProjects).length, 1);
  });

  it('JSON interface', () => {
    let controller = new GameController();
    controller.startNewGame();
    let id = Object.keys(controller.module.allBuildings())[0];
    let buildingTemplate = controller.module.allBuildings()[id];

    controller.planBuilding(id);
    
    let newBuildingId = Object.keys(controller.getAllMyBuilding())[0];
    let building = controller.getBuilding(newBuildingId);

    assert.equal(buildingTemplate.name, building.name);
  });
});
