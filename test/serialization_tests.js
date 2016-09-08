const assert = require('chai').assert;
const CitySerializer = require("../lib/city/CitySerializer.js").CitySerializer;

const SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;
const CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;

const CityResource = require('../lib/city/CityResource.js').CityResource;
const City = require('../lib/city/City.js').City;

const CharacterOperationJS = require("../lib/city/CharacterOperation.js");
const CityCharacter = CharacterOperationJS.CityCharacter;
const EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;
const CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

describe('Serialization', () => {
	let time = 10;
	let amount = 100;
	let resource =  CityResource.gold(amount);
	let resources = [resource];
	let operation = new EarnResourceForPlayerOperation({
		time: time,
		resources: resources,
	});

	it('Deserialized player continues building', () => {
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
