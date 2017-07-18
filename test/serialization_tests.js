const assert = require('chai').assert;
const CitySerializer = require("../lib/city/CitySerializer.js").default;

const CityPlayer = require('../lib/city/CityPlayer.js').default;

const CityResource = require('../lib/city/CityResource.js').CityResource;
const City = require('../lib/city/City.js').default;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;

describe('Serialization', () => {
	let time = 10;
	let totalTime = 100;
	
	it('Deserialized player continues building', () => {
		let construction = 10;
		let building = new Building({
			time: totalTime,
		});
		let player = new CityPlayer();
		player.city.planBuilding({
			building: building
		});
		
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
