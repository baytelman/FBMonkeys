var assert = require('chai').assert
var Player = require('../lib/_base/Player.js').Player;
var SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

var CityTestUtilities = require("./utils/common.js").CityTestUtilities;
var CityJS = require('../lib/city/City.js')
var City = CityJS.City;
var OverlappingBuildingError = CityJS.OverlappingBuildingError;

var CityResource = require('../lib/city/CityResource.js').CityResource;

var BuildingJS = require('../lib/city/Building.js');
var Building = BuildingJS.Building;
var BuildingConstructionAction = BuildingJS.BuildingConstructionAction
var ProjectAlreadyCompletedError = BuildingJS.ProjectAlreadyCompletedError;

describe('City', () => {
	it('starts with one building', () => {
		let city = new City();
		assert.strictEqual(city.buildings.length, 1)

		let location = city.buildings[0].location;
		assert.isTrue(location.is(new SquareCoordinate(0,0)));
	});

	it('can retrieve building by location', () => {
		let city = new City();
		let locations = [
			city.buildings[0].location,
			new SquareCoordinate(1,0),
			new SquareCoordinate(0,-1),
		];
		let buildings = [
			city.buildings[0],
			new Building(),
			new Building(),
		];
		for (var i = 1; i < buildings.length; i++) {
			city.addBuilding({
				building: buildings[i],
				location: locations[i],
			});
		}
		locations.forEach(function(location, index) {
			assert.strictEqual(city.buildingAtLocation(location), buildings[index]);
		});
	});

	it('have limits', () => {
		let city = new City();
		let locations = [
			new SquareCoordinate(8,0),
			new SquareCoordinate(0,10),
			new SquareCoordinate(4,-10),
			new SquareCoordinate(-8,5),
		];
		locations.forEach(function(location, index) {
			city.addBuilding({
				building: new Building(),
				location: location,
			});
		});

		let [minX, minY, maxX, maxY] = city.limits;
		assert.strictEqual(minX, -8);
		assert.strictEqual(minY, -10);
		assert.strictEqual(maxX, 8);
		assert.strictEqual(maxY, 10);
	});

	it('cannot overlap buildings', () => {
		let city = new City();
		let location = city.buildings[0].location;
		let building = new Building();

		assert.throw(()=>city.addBuilding({building:building}));
	});

});

describe('Building Construction', () => {
	let resource = CityResource.gold(100);

	it('have action costs', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let building = new Building({
			costs: [resource]
		});

		let action = new BuildingConstructionAction({
			building: building,
			location: new SquareCoordinate(1,0)
		});

		assert.isFalse(action.isAffordable(player));
		player.earnResource(resource);
		assert.isTrue(action.isAffordable(player));

		action.executeForPlayer(player);
		assert.strictEqual(player.city.buildings.length, 2);
	});

	it('cannot take place in same place', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let building = new Building({
			costs: [resource]
		});

		let action = new BuildingConstructionAction({
			building: building,
			location: new SquareCoordinate(1,0)
		});

		player.earnResource(resource);
		player.earnResource(resource);

		action.executeForPlayer(player);
		assert.throw(() =>action.executeForPlayer(player));

	});
	it('have costs', () => {
		let costs = [CityResource.construction(100)];
		let building = new Building({
			costs: costs
		});

		assert.isFalse(building.complete(CityResource.resourcesWithMultiplier(costs, 0.5)));
		assert.isFalse(building.isCompleted());
		assert.strictEqual(building.progress(), 0.5);

		assert.isTrue(building.complete(CityResource.resourcesWithMultiplier(costs, 0.5)));
		assert.isTrue(building.isCompleted());

		assert.throw(()=>building.complete(CityResource.resourcesWithMultiplier(costs, 0.5)));
	});
});
