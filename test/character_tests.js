var assert = require('chai').assert
var Player = require('../lib/_base/Player.js').Player;
var SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

var CityTestUtilities = require("./utils/common.js").CityTestUtilities;
var MutableObject = require("../lib/_base/utils/Utils.js").MutableObject;

var CityJS = require('../lib/city/City.js')
var City = CityJS.City;
var OverlappingBuildingError = CityJS.OverlappingBuildingError;

var CityResource = require('../lib/city/CityResource.js').CityResource;

var BuildingJS = require('../lib/city/Building.js');
var Building = BuildingJS.Building;
var ProjectAlreadyCompletedError = BuildingJS.ProjectAlreadyCompletedError;

var CharacterOperationJS = require("../lib/city/CharacterOperation.js");
var EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;
var CityCharacter = CharacterOperationJS.CityCharacter;

describe('Characters', () => {
	let time = 10;
	let resources = [CityResource.gold(100)];
	let operation = new EarnResourceForPlayerOperation({
		time: time,
		resources: resources,
	});

	it('begins operation operation', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		assert.instanceOf(operation, EarnResourceForPlayerOperation);
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time/2);
		assert.instanceOf(updates[0], EarnResourceForPlayerOperation);
		assert.strictEqual(updates.length, 1, "Began");

		let mutableCopy = MutableObject.mutableCopy(updates[0]);
		assert.instanceOf(mutableCopy, EarnResourceForPlayerOperation);
	});

	it('can complete an operation', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time);
		assert.instanceOf(updates[0], EarnResourceForPlayerOperation);
		assert.instanceOf(updates[1], EarnResourceForPlayerOperation);
		assert.instanceOf(updates[2], CityResource);
		assert.instanceOf(updates[3], EarnResourceForPlayerOperation);
		assert.strictEqual(updates.length, 4, "Began, Complete, Resource, Began");
	});

	it('do operations while allows', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let time = 10;
		let resources = [CityResource.gold(100)];
		let action = new EarnResourceForPlayerOperation({
			time: time,
			resources: resources,
		});
		let character = new CityCharacter({
			operations:[action]
		});

		player.addCharacter(character);

		let updates = player.updateTime(time/4.0);
		assert.instanceOf(updates[0], EarnResourceForPlayerOperation);
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.strictEqual(updates.length, 1, "Began");

		updates = player.updateTime(time/4.0);
		assert.strictEqual(updates.length, 0, "Nothing new");
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.isFalse(CityResource.playerCanAfford(player, resources));

		updates = player.updateTime(time/2);
		assert.instanceOf(updates[0], EarnResourceForPlayerOperation);
		assert.instanceOf(updates[1], CityResource);
		assert.instanceOf(updates[2], EarnResourceForPlayerOperation);
		assert.strictEqual(updates.length, 3, "Completed action, Earned Resources, New Action");

		assert.isTrue(CityResource.playerCanAfford(player, resources));

		updates = player.updateTime(time * 5);
		assert.strictEqual(updates.length, 3*5, "Completed action, earned resources, new action, 5 times");
	});
});
