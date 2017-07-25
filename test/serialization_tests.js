const assert = require('chai').assert;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;
const CitySerializer = require("../lib/city/CitySerializer.js").default;

const CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;

const CityResource = require('../lib/city/CityResource.js').CityResource;
const City = require('../lib/city/City.js').default;


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
	
	it('Can deserialize recursive references', () => {
		let b = {
			id: 'b',
			name: 'nameB',
		};
		let c = {
			id: 'c',
			name: 'nameC',
		};
		let a = {
			id: 'a',
			name: 'nameA',
			children: [b, c],
			favoriteChild: b,
		};
		b.myself = b;
		b.mom = a;
		c.friend = a;
		
		let json = CitySerializer.serialize(a);
		let deserializedA = CitySerializer.deserialize(json);
		
		assert.equal('nameA', a.children[0].myself.mom.name);
		assert.equal('nameA', a.children[1].friend.name);
		
		var countA = (json.match(/nameA/g) || []).length;
		var countB = (json.match(/nameB/g) || []).length;
		var countC = (json.match(/nameC/g) || []).length;
		
		assert.equal(1, countA);
		assert.equal(1, countB);
		assert.equal(1, countC);
	});
	
	it('Cannot deserialize unknown class', () => {
		class UnknownClass {
			constructor() {
				this.name = 'unknownClass';
				this.id = 123;
			}
		}
		
		let json = CitySerializer.serialize(new UnknownClass());
		assert.throw(()=>CitySerializer.deserialize(json), Error);
	});
});
