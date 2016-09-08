var assert = require('chai').assert;
var GameController = require("../lib/controller/GameController.js").GameController;
var CityEvent = require('../lib/city/CityEvent.js').CityEvent;

describe('Game Controller', () => {
  it('Implement Listener', () => {
    let controller = new GameController();

    let called = false;
    controller.on(CityEvent.kEarnResourceEvent, () => {
      called = true;
    });

    controller.startNewGame();
    assert.isFalse(called);
    controller.tick(10);
    assert.isTrue(called);
  });
});
