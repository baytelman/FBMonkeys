var assert = require('chai').assert
var PlayerJS = require('../lib/_base/Player.js');
var Player = PlayerJS.Player;

var EffectJS = require('../lib/_base/Effect.js');
var EnableResourceEffect = EffectJS.EnableResourceEffect;

var ResourceJS = require('../lib/_base/Resource.js');
var Resource = ResourceJS.Resource;
var ResourceConsumingAction = ResourceJS.ResourceConsumingAction;
var InsuficientResourcesError = ResourceJS.InsuficientResourcesError;

describe('Resources', () => {

  let resourceType = "resource";
  let amount = 100;
  let multiplier = 10;
  let maxResourceDefault = 1000;

  function enabledPlayer(maxResource) {
    if (!maxResource) {
      maxResource = maxResourceDefault;
    }
    return new Player({
      name: "Name",
      effects: [
        new EnableResourceEffect({
          type: resourceType,
          amount: maxResource
        })
      ]
    });
  };

  it('can be multiplied', () => {
    let resource = new Resource(resourceType, amount);
    let moreResources = resource.resourceWithMultiplier(multiplier);
    assert.strictEqual(moreResources.amount,  amount * multiplier);
  });

  it('can be earned', () => {
    let player = enabledPlayer();
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

    let player = enabledPlayer();
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
