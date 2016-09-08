const assert = require('chai').assert;
const SquareCoordinate = require('../lib/_base/SquareCoordinate.js').SquareCoordinate;

const MutableObject = require("../lib/_base/utils/Utils.js").MutableObject;

const EffectJS = require("../lib/_base/Effect.js");

const CityEvent = require('../lib/city/CityEvent.js').CityEvent;
const CityPlayer = require('../lib/city/CityPlayer.js').CityPlayer;
const CityJS = require('../lib/city/City.js')
const City = CityJS.City;

const CityResource = require('../lib/city/CityResource.js').CityResource;

const CharacterOperationJS = require("../lib/city/CharacterOperation.js");
const CityCharacter = CharacterOperationJS.CityCharacter;
const CharacterOperation = CharacterOperationJS.CharacterOperation;
const EarnResourceForPlayerOperation = CharacterOperationJS.EarnResourceForPlayerOperation;

const BuildingJS = require('../lib/city/Building.js');
const Building = BuildingJS.Building;
const CompleteBuildingOperation = CharacterOperationJS.CompleteBuildingOperation;

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
		let player = new CityPlayer();
		assert.instanceOf(operation, EarnResourceForPlayerOperation, "Began earning");
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time/2);
		assert.instanceOf(updates[0].object, EarnResourceForPlayerOperation, "Began earning");
		assert.strictEqual(updates[updates.length-1].type, CityEvent.kCharacterOperationProgressEvent);
	});

	it('can be completed fully', () => {
		let player = new CityPlayer();
		let character = new CityCharacter({
			operations:[operation]
		});
		player.addCharacter(character);

		let updates = player.updateTime(time);
		assert.instanceOf(updates[0].object, EarnResourceForPlayerOperation, "Began earning");
		assert.isFalse(updates[0].object.completed, "Began earning");

		assert.instanceOf(updates[updates.length - 3].object, EarnResourceForPlayerOperation, "Completed earning");
		assert.isTrue(updates[updates.length - 3].object.completed, "Completed earning");

		assert.instanceOf(updates[updates.length - 2].object, CityResource);

		assert.instanceOf(updates[updates.length - 1].object, EarnResourceForPlayerOperation, "Began next earning");
	});

	it('can be completed partially', () => {
		let player = new CityPlayer();
		let operations = new EarnResourceForPlayerOperation({
			time: time,
			resources: resources,
		});
		let character = new CityCharacter({
			operations:[operations]
		});

		character = player.addCharacter(character);

		let updates = player.updateTime(time/4.0);
		assert.instanceOf(updates[0].object, EarnResourceForPlayerOperation, "Began earning");
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);

		updates = player.updateTime(time/4.0);
		updates.forEach(function(update) {
			assert.strictEqual(update.type, CityEvent.kCharacterOperationProgressEvent, "Nothing new");
		});
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.isFalse(player.canAfford(resources));

		updates = player.updateTime(time/2.0);

		assert.instanceOf(updates[updates.length-3].object, EarnResourceForPlayerOperation, "Completed earning");
		assert.instanceOf(updates[updates.length-2].object, CityResource);
		assert.instanceOf(updates[updates.length-1].object, EarnResourceForPlayerOperation, "Began next earning");

		assert.isTrue(player.canAfford(resources));
	});

	it('choose enabled operations only', () => {
		let resTypes = ['a', 'b', 'c']; /* Allow a lot of a, b, and c */
		let player = new CityPlayer();

		let operations = resTypes.map(function(type) {
			return new EarnResourceForPlayerOperation({
				time: time,
				resources: [new CityResource(type, 100)],
			});
		});
		let character = new CityCharacter({
			operations:operations
		});
		character = player.addCharacter(character);

		let updates = player.updateTime(0.1);
		/* Began earning a */
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.strictEqual(character.currentOperation.resources[0].type, resTypes[0]);
		operations[0].disable();

		/* Finish a, but move to b now, because a is disabled */
		updates = player.updateTime(time);
		let generatedResource = updates[updates.length - 3].object;
		assert.instanceOf(generatedResource, CityResource);
		assert.strictEqual(generatedResource.type, resTypes[0]);
		/* We are making b now */
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.strictEqual(character.currentOperation.resources[0].type, resTypes[1]);
		operations[0].enable();
		/* Finish b, but move to a now, because a is enabled */
		updates = player.updateTime(time);
		generatedResource = updates[updates.length - 3].object;
		assert.instanceOf(generatedResource, CityResource);
		assert.strictEqual(generatedResource.type, resTypes[1]);
		/* We are back to making a */
		/* We are making b now */
		assert.instanceOf(character.currentOperation, EarnResourceForPlayerOperation);
		assert.strictEqual(character.currentOperation.resources[0].type, resTypes[0]);
	});


	it('can change priority', () => {
		let resTypes = ['a', 'b', 'c', 'd']; /* Allow a lot of a, b, c and d */
		let player = new CityPlayer();

		let operations = resTypes.map(function(type) {
			return new EarnResourceForPlayerOperation({
				time: time,
				resources: [new CityResource(type, amount)],
			});
		});
		let character = new CityCharacter({
			operations:operations
		});
		player.addCharacter(character);

		character.setOperationPriority(operations[0], 0); /* a is now Top priority, top of the list */
		character.setOperationPriority(operations[1], 0); /* Now b is now Top priority, top of the list */
		character.setOperationPriority(operations[2], 0); /* c is now */
		character.setOperationPriority(operations[3], 1); /* d is second priority */

		operations[2].disable();
		let prioritized2 = character.prioritizedAvailableOperations({player:player});
		operations[2].enable();
		let prioritized1 = character.prioritizedAvailableOperations({player:player});

		assert.deepEqual(
			prioritized1, [operations[2], operations[3], operations[1], operations[0]]
		);
		assert.deepEqual(
			prioritized2, [operations[3], operations[1], operations[0]]
		);
	});

	it("builds buldings if required", () => {
		let player = new CityPlayer();
		let character = new CityCharacter({
			operations:[new CompleteBuildingOperation({
				time: time,
				amount: 1
			})]
		});
		player.addCharacter(character);

		let construction = 10;
		let building = new Building({
			costs: [ CityResource.construction(construction)],
		});
		let placedBuildingEvent = player.city.planBuilding({
			building: building,
			location: new SquareCoordinate(-1,0)
		});
		let placedBuilding = player.city.buildings[placedBuildingEvent.object.id];

		let updates = player.updateTime(time);
		assert.strictEqual(Math.round(100*placedBuilding.progress()), Math.round(100.0*(1.0/construction)));
		assert.instanceOf(updates[0].object, CompleteBuildingOperation, "Began incremental construction");
		assert.instanceOf(updates[updates.length - 4].object, CompleteBuildingOperation, "Finish operation");
		assert.instanceOf(updates[updates.length - 3].object, CityResource, "Producing some construction");
		assert.instanceOf(updates[updates.length - 2].object, Building, "Constructed incrementally part the project (building)");
		assert.instanceOf(updates[updates.length - 1].object, CompleteBuildingOperation, "Began next construction");

		updates = player.updateTime(8*time);
		assert.isFalse(placedBuilding.isCompleted());
		updates = player.updateTime(time);
		assert.isTrue(placedBuilding.isCompleted());
		assert.isNull(character.currentOperation);
		assert.instanceOf(updates[updates.length - 3].object, CompleteBuildingOperation, "Completed building");
		assert.instanceOf(updates[updates.length - 2].object, CityResource, "Final incremental construction");
		assert.instanceOf(updates[updates.length - 1].object, Building);
	});
});
