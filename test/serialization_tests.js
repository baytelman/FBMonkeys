var assert = require('chai').assert;
var CitySerializer = require("../lib/city/CitySerializer.js").CitySerializer;

var SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;
var CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;

var CityResource = require('../lib/city/CityResource.js').CityResource;
var City = require('../lib/city/City.js').City;

var CharacterOperationJS = require("../lib/city/CharacterOperation.js");
var CityCharacter = CharacterOperationJS.CityCharacter;
var EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;

var BuildingJS = require('../lib/city/Building.js');
var Building = BuildingJS.Building;
var CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

describe('Character Operations', () => {
	let time = 10;
	let amount = 100;
	let resource =  CityResource.gold(amount);
	let resources = [resource];
	let operation = new EarnResourceForPlayerOperation({
		time: time,
		resources: resources,
	});

	it('begins operation operation', () => {
		let construction = 10;
		let building = new Building({
			costs: [ CityResource.construction(construction)],
		});
		let player = new CityPlayer({
			city:new City({
				defaultBuilding:building
			})
		});

		let character = new CityCharacter({
			operations:[new CompleteBuildingOperation({
				time: time,
				amount: 1
			})]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time);
		let b = Object.values(player.city.buildings)[0];
		assert.closeTo(b.progress(), 0.1, 0.01);

		let json = CitySerializer.serialize(player);
		assert.include(json, player.id);
		player = CitySerializer.deserialize(json);

		updates = player.updateTime(time);
		assert.isTrue(updates.length > 0);
		b = Object.values(player.city.buildings)[0];
		assert.closeTo(b.progress(), 0.2, 0.01);
	});
});
