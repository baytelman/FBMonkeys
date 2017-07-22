const assert = require('chai').assert
const PlayerJS = require('../lib/city/CityPlayer.js');
const CityPlayer = PlayerJS.default;

const ResourceJS = require('../lib/city/CityResource.js');
const CityResource = ResourceJS.CityResource;
const ResourceConsumingAction = ResourceJS.ResourceConsumingAction;
const InsuficientResourcesError = ResourceJS.InsuficientResourcesError;

const resourceType = "kTestResourceType";
const resourceType2 = "kTestResourceType2";
const createResource = (amount) => new CityResource(resourceType, amount);
const createResource2 = (amount) => new CityResource(resourceType2, amount);

describe('Resources', () => {
  
  let amount = 100;
  let multiplier = 10;
  
  it('can be multiplied', () => {
    let resource = createResource(amount);
    let moreResources = resource.resourceWithMultiplier(multiplier);
    assert.strictEqual(moreResources.amount,  amount * multiplier);
  });
  
  it('can be earned', () => {
    let player = new CityPlayer();
    let resource = createResource(amount);
    assert.strictEqual(player.getResourceAmountForType(resourceType),  0);
    
    player.earnResource(resource);
    assert.strictEqual(player.getResourceAmountForType(resourceType),  amount);
    
    let moreResources = resource.resourceWithMultiplier(multiplier);
    assert.strictEqual(moreResources.amount,  amount * multiplier);
  });
  
  it('can be covered', () => {
    let little = 5;
    let more  = 10;
    let aLot = 20;
    
    let haveResources = [createResource(little), createResource2(aLot)];
    let needResources = [createResource(aLot), createResource2(more)];
    
    // Have 15 (5 + 10) of 30 (20 + 10) needed
    assert.equal(0.5, CityResource.resourcesCoverCosts(haveResources, needResources));
    
    // Have 30 (20 + 10) of 30 (20 + 10) needed
    let nowHaveMore = [createResource(aLot), createResource2(aLot)];
    assert.equal(1, CityResource.resourcesCoverCosts(nowHaveMore, needResources));
  });
  
  it('cannot spend if dont have', () => {   
    let player = new CityPlayer();
    let resource = createResource(amount);
    assert.throw(()=> player.spendResource(resource));

    player.earnResource(resource.resourceWithMultiplier(.5));
    assert.throw(()=> player.spendResource(resource));

    player.earnResource(resource.resourceWithMultiplier(.5));
    player.spendResource(resource);
  });
  
});

describe('Resource Consuming Actions', () => {
  let kActionName = "kActionName"; 
  let amount = 100;
  let resources = [ createResource(amount) ];
  
  it('can become available', () => {
    let player = new CityPlayer();
    player.earnResources(resources);
    
    let available = false;
    let actionCalled = false;
    
    let action = new ResourceConsumingAction(
      () => kActionName,
      () => available,
      () => resources,
      () => actionCalled = true
    );
    
    assert.equal(kActionName, action.displayName());
    
    assert.isFalse(action.isAvailable(player));
    assert.throw(()=>action.executeForPlayer(player));
    assert.isFalse(actionCalled);
    
    available = true;
    assert.isTrue(action.isAvailable(player));
    action.executeForPlayer(player);
    assert.isTrue(actionCalled);
  });
  
  it('consume resources', () => {
    let player = new CityPlayer();
    let actionCalled = false;
    let resources = [ createResource(amount) ];
    
    let kActionName = "kActionName"; 
    let action = new ResourceConsumingAction(
      () => kActionName,
      () => true,
      () => resources,
      () => actionCalled = true
    );
    
    assert.equal(kActionName, action.displayName());
    
    assert.isTrue(action.isAvailable(player));
    assert.isFalse(action.isAffordable(player));
    
    assert.throw(()=>action.executeForPlayer(player));
    assert.isFalse(actionCalled);
    
    player.earnResources(resources);
    assert.isTrue(action.isAffordable(player));
    
    action.executeForPlayer(player);
    assert.isTrue(actionCalled);
    
    assert.isFalse(action.isAffordable(player), "Player cannot afford it twice");
  });
});
