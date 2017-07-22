const assert = require('chai').assert

const CityPlayer = require('../lib/city/CityPlayer.js').default;
const CityEvent = require('../lib/city/CityEvent.js').CityEvent;
const City = require('../lib/city/City.js').default;

const CityResource = require('../lib/city/CityResource.js').CityResource;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;
const BuildingConstructionAction = BuildingJS.BuildingConstructionAction
const ProjectAlreadyCompletedError = BuildingJS.ProjectAlreadyCompletedError;

describe('City', () => {
	it('starts with zero building', () => {
		let city = new City();
		assert.strictEqual(Object.keys(city.buildings).length, 0)
	});
});

describe('Building Construction', () => {
	let resource = CityResource.gold(100);
	let time = 10;
	let totalTime = 100;

	let building = new Building({
		costs: [resource],
		time: totalTime,
	});

	it('have action costs', () => {
		let player = new CityPlayer();

		let action = new BuildingConstructionAction({
			building: building,
		});

		assert.isFalse(action.isAffordable(player));
		player.earnResource(resource);
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

		updates = player.updateTime(totalTime);
		assert.strictEqual(updates[updates.length-1].type, CityEvent.kBuildingCompletedEvent);
		assert.isTrue(b.isCompleted());
	});
});
