import {assert} from 'chai'
import {CityResource, ResourceConsumingAction, InsuficientResourcesError, UnavailableActionError} from '../lib/city/CityResource';
import {Building} from '../lib/city/Building';
import {CityPlayer} from '../lib/city/CityPlayer';

const resourceType = "kTestResourceType";
const resourceType2 = "kTestResourceType2";
const resourceType3 = "kTestResourceType3";
const createResource = (amount) => new CityResource(resourceType, amount);
const createResource2 = (amount) => new CityResource(resourceType2, amount);
const createResource3 = (amount) => new CityResource(resourceType3, amount);

let amount = 100;
let playerCapacity = {
  initialCapacity: {
    [resourceType]: amount * 2,
    [resourceType2]: amount * 5
  }
};

describe('Resources', () => {

  let multiplier = 10;

  it('Player has capacity', () => {
    let player = new CityPlayer(playerCapacity);

    const capacity = player.getCapacity();
    assert.strictEqual(capacity[resourceType], amount * 2);
    assert.strictEqual(capacity[resourceType2], amount * 5);
  });

  it('can only earn up to a limit', () => {
    let player = new CityPlayer({
      initialCapacity: {
        [resourceType]: amount * 2,
        [resourceType2]: amount * 5
      }
    });
    player.earnResources([
      createResource(amount * 3),
      createResource2(amount * 3),
      createResource3(amount * 3)
    ]);

    assert.strictEqual(amount * 2, player.getResourceAmountForType(resourceType));
    assert.strictEqual(amount * 3, player.getResourceAmountForType(resourceType2));
    assert.strictEqual(0, player.getResourceAmountForType(resourceType3));
  });
});
