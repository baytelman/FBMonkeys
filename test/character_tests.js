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
var PlayerEarnResourceOperation = CharacterOperationJS.PlayerEarnResourceOperation;
var CityCharacter = CharacterOperationJS.CityCharacter;

describe('Characters', () => {
	let time = 10;
	let resources = [CityResource.gold(100)];
	let operation = new PlayerEarnResourceOperation({
		time: time,
		resources: resources,
	});

	it('begins operation operation', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		assert.instanceOf(operation, PlayerEarnResourceOperation);
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time/2);
		assert.instanceOf(updates[0], PlayerEarnResourceOperation);
		assert.strictEqual(updates.length, 1, "Began");

		let mutableCopy = MutableObject.mutableCopy(updates[0]);
		assert.instanceOf(mutableCopy, PlayerEarnResourceOperation);
	});

	it('can complete an operation', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time);
		assert.instanceOf(updates[0], PlayerEarnResourceOperation);
		assert.instanceOf(updates[1], PlayerEarnResourceOperation);
		assert.instanceOf(updates[2], CityResource);
		assert.instanceOf(updates[3], PlayerEarnResourceOperation);
		assert.strictEqual(updates.length, 4, "Began, Complete, Resource, Began");
	});

	it('do operations while allows', () => {
		let player = CityTestUtilities.enabledCityPlayer();
		let time = 10;
		let resources = [CityResource.gold(100)];
		let action = new PlayerEarnResourceOperation({
			time: time,
			resources: resources,
		});
		let character = new CityCharacter({
			operations:[action]
		});

		player.addCharacter(character);

		let updates = player.updateTime(time/4.0);
		assert.instanceOf(updates[0], PlayerEarnResourceOperation);
		assert.instanceOf(character.currentOperation, PlayerEarnResourceOperation);
		assert.strictEqual(updates.length, 1, "Began");

		updates = player.updateTime(time/4.0);
		assert.strictEqual(updates.length, 0, "Nothing new");
		assert.instanceOf(character.currentOperation, PlayerEarnResourceOperation);
		assert.isFalse(CityResource.playerCanAfford(player, resources));

		updates = player.updateTime(time/2);
		assert.instanceOf(updates[0], PlayerEarnResourceOperation);
		assert.instanceOf(updates[1], CityResource);
		assert.instanceOf(updates[2], PlayerEarnResourceOperation);
		assert.strictEqual(updates.length, 3, "Completed action, Earned Resources, New Action");

		assert.isTrue(CityResource.playerCanAfford(player, resources));

		updates = player.updateTime(time * 5);
		assert.strictEqual(updates.length, 3*5, "Completed action, earned resources, new action, 5 times");
	});
});
