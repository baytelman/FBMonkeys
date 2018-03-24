import {assert} from 'chai'

import {CityResource} from '../city/CityResource';
import CityBuilding from '../city/CityBuilding';
import {CityPlayer, CapacityGrantingEffect} from '../city/CityPlayer';

const resourceType1 = "kTestResourceType";
const resourceType2 = "kTestResourceType2";
const resourceType3 = "kTestResourceType3";
const createResource1 = (amount) => new CityResource(resourceType1, amount);
const createResource2 = (amount) => new CityResource(resourceType2, amount);
const createResource3 = (amount) => new CityResource(resourceType3, amount);

let amount = 100;
let playerCapacity = {
  initialCapacity: {
    [resourceType1]: amount * 2,
    [resourceType2]: amount * 5
  }
};

let building = new CityBuilding({
  time: 100,
  permanentEffects: [new CapacityGrantingEffect({
    additions: {
      [resourceType2]: amount * 3,
      [resourceType3]: amount * 1
    }
  })]
});

describe('Resources Capacity', () => {
  
  let multiplier = 10;
  
  it('Player has capacity', () => {
    let player = new CityPlayer(playerCapacity);
    
    const capacity = player.getCapacity();
    assert.strictEqual(capacity[resourceType1] || 0, amount * 2);
    assert.strictEqual(capacity[resourceType2] || 0, amount * 5);
    assert.strictEqual(capacity[resourceType3] || 0, 0);
  });
  
  it('Player capacity can be increased by buildings', () => {
    let player = new CityPlayer(playerCapacity);
    
    player
    .city
    .planBuilding({building: building});
    
    const capacity = player.getCapacity();
    assert.strictEqual(capacity[resourceType1] || 0, amount * 2);
    assert.strictEqual(capacity[resourceType2] || 0, amount * 5);
    assert.strictEqual(capacity[resourceType3] || 0, 0);
    
    player.updateTime(building.setupTime);
    const capacityAfter = player.getCapacity();
    assert.strictEqual(capacityAfter[resourceType1] || 0, amount * 2);
    assert.strictEqual(capacityAfter[resourceType2] || 0, amount * 8);
    assert.strictEqual(capacityAfter[resourceType3] || 0, amount * 1);
  });
    
  it('can only earn up to a limit', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [resourceType1]: amount * 2,
        [resourceType2]: amount * 5
      }
    });
    
    player
    .city
    .planBuilding({building: building});
    
    player.earnResources([
      createResource1(amount * 3),
      createResource2(amount * 3),
      createResource3(amount * 3)
    ]);
    
    assert.strictEqual(amount * 2, player.getResourceAmountForType(resourceType1));
    assert.strictEqual(amount * 3, player.getResourceAmountForType(resourceType2));
    assert.strictEqual(0, player.getResourceAmountForType(resourceType3));
    
    player.updateTime(building.setupTime);
    
    player.earnResources([
      createResource1(amount * 3),
      createResource2(amount * 3),
      createResource3(amount * 3)
    ]);
    
    assert.strictEqual(amount * 2, player.getResourceAmountForType(resourceType1));
    assert.strictEqual(amount * 6, player.getResourceAmountForType(resourceType2));
    assert.strictEqual(amount * 1, player.getResourceAmountForType(resourceType3));
  });
});
