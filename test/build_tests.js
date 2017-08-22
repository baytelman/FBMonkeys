import {assert} from 'chai'

import {CityPlayer} from '../lib/city/CityPlayer';
import CityEvent from '../lib/city/CityEvent';
import City from '../lib/city/City';

import {CityResource} from '../lib/city/CityResource';

import CityBuilding, {BuildingConstructionAction, ProjectAlreadyCompletedError} from '../lib/city/CityBuilding';

const kGold = 'gold';
const gold = (amount) => new CityResource(kGold, amount);

describe('City', () => {
	it('starts with zero building', () => {
		let city = new City();
		assert.strictEqual(Object.keys(city.buildings).length, 0)
	});
});

describe('CityBuilding Construction', () => {
	let resource = gold(100);
	let time = 10;
	let totalTime = 100;
	
	let building = new CityBuilding({
		cost: [resource],
		time: totalTime,
	});
	
	it('cannot compute cost without a player', () => {
		let player = new CityPlayer({
			initialCapacity: {
				[kGold]: 1000
			}
		});
		
		let action = new BuildingConstructionAction({
			building: building,
		});

		assert.throw(() => action.cost(), Error);
	});

	it('have action cost', () => {
		let player = new CityPlayer({
			initialCapacity: {
				[kGold]: 1000
			}
		});
		
		let action = new BuildingConstructionAction({
			building: building,
		});
		
		assert.isFalse(action.isAffordable(player));
		player.earnResources([resource]);
		assert.isTrue(action.isAffordable(player));
		
		assert.strictEqual(Object.keys(player.city.buildings).length, 0);
		action.executeForPlayer(player);
		assert.strictEqual(Object.keys(player.city.buildings).length, 1);
	});
	
	it('take time to build', () => {
		
		let player = new CityPlayer();
		player.city.planBuilding({
			building: building
		});
		
		let updates = player.updateTime(time);
		let b = Object.values(player.city.buildings)[0];
		assert.closeTo(b.progress(), 0.1, 0.01);
		
		updates = player.updateTime(time);
		assert.strictEqual(updates[updates.length-1].type, CityEvent.kBuildingProgressEvent);
		b = Object.values(player.city.buildings)[0];
		assert.closeTo(b.progress(), 0.2, 0.01);
		assert.include(b.toString(), 'Setting Up');
		
		updates = player.updateTime(totalTime);
		assert.strictEqual(updates[updates.length-1].type, CityEvent.kBuildingCompletedEvent);
		assert.isTrue(b.isCompleted());
		assert.notInclude(b.toString(), 'Setting Up');
	});
	
	it('have increasing cost', () => {
		let player = new CityPlayer({
			initialCapacity: {
				[kGold]: 1000
			}
		});
		player.earnResources(CityResource.resourcesWithMultiplier([resource], 100));	
		
		let building = new CityBuilding({
			cost: [resource],
			time: totalTime,
			costFactor: 2
		});
		
		let action = new BuildingConstructionAction({
			building: building,
		});
		
		action.executeForPlayer(player);
		let costForSecond = action.cost(player);
		assert.strictEqual(costForSecond[0].amount, 100 * 2);
		
		action.executeForPlayer(player);
		let costForThird = action.cost(player);
		assert.strictEqual(costForThird[0].amount, 100 * 4);
	});
});
