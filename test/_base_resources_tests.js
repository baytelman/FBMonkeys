const assert = require('chai').assert
const PlayerJS = require('../lib/_base/Player.js');
const Player = PlayerJS.Player;

const EffectJS = require('../lib/_base/Effect.js');

const ResourceJS = require('../lib/_base/Resource.js');
const Resource = ResourceJS.Resource;
const ResourceConsumingAction = ResourceJS.ResourceConsumingAction;
const InsuficientResourcesError = ResourceJS.InsuficientResourcesError;

describe('Resources', () => {

  let resourceType = "resource";
  let amount = 100;
  let multiplier = 10;

  it('can be multiplied', () => {
    let resource = new Resource(resourceType, amount);
    let moreResources = resource.resourceWithMultiplier(multiplier);
    assert.strictEqual(moreResources.amount,  amount * multiplier);
  });

  it('can be earned', () => {
    let player = new Player();
    let resource = new Resource(resourceType, amount);
    assert.strictEqual(player.getResourceAmountForType(resourceType),  0);

    player.earnResource(resource);
    assert.strictEqual(player.getResourceAmountForType(resourceType),  amount);

    let moreResources = resource.resourceWithMultiplier(multiplier);
    assert.strictEqual(moreResources.amount,  amount * multiplier);
  });

  it('are consumed', () => {
    let actionCalled = false;
    let resources = [ new Resource(resourceType, amount) ];

    let player = new Player();
    let action = new ResourceConsumingAction(
      "Action",
      function() { return true; },
      function() { return resources; },
      function() { actionCalled = true; }
    );
    assert.isFalse(action.isAffordable(player));
    assert.throw(()=>action.executeForPlayer(player));
    assert.throw(()=>action.executeForPlayer(player));

    player.earnResources(resources);
    assert.isTrue(action.isAffordable(player));

    action.executeForPlayer(player);
    assert.isTrue(actionCalled);

    assert.isFalse(action.isAffordable(player), "Player cannot afford it twice");
  });
});
