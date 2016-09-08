var assert = require('chai').assert;
var GameController = require("../lib/controller/GameController.js").GameController;
var CityEvent = require('../lib/city/CityEvent.js').CityEvent;

describe('Game Controller', () => {
  it('Generate Resources', () => {
    let controller = new GameController();
    controller.startNewGame();

    let called = false;
    controller.on(CityEvent.kEarnResourceEvent, () => {
      called = true;
    });

    assert.isFalse(called);
    controller.tick(10);
    assert.isTrue(called);
  });

  it('Can Place Buildings', () => {
    let controller = new GameController();
    controller.startNewGame();

    let called = false;
    controller.on(CityEvent.kBuildingPlannedEvent, () => {
      called = true;
    });

    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 1);
    assert.strictEqual(Object.keys(controller.getAllMyCharacters()).length, 3);

    assert.isFalse(called);

    let id = Object.keys(controller.module.availableBuildings())[0];
    controller.planBuilding(id, -1, -1);
    assert.strictEqual(Object.keys(controller.getAllMyBuilding()).length, 2);
    assert.isTrue(called);
  });
});
