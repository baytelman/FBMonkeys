
tests.push(function testNewCityHasOneBuilding() {
	let city = new City();

	let count = city.buildings.length;
	if (count != 1) {
		throw new Error("City starts with one building");
	}

	let location = city.buildings[0].location;
	if (!location.is(new SquareCoordinate(0,0))) {
		throw new Error("City's first building is always in the center");
	}
});

tests.push(function testCityCanGetBuildingsByLocation() {
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
		if (city.buildingAtLocation(location) !== buildings[index]) {
			throw new Error("Building should be found at its location.");
		}
	});
});

tests.push(function testCityLimits() {
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

	if (minX != -8 || minY != -10 || maxX != 8 || maxY != 10) {
		throw new Error("Wrong city limits.");
	}
});

tests.push(function testOverlappingBuildings() {
	let city = new City();
	let location = city.buildings[0].location;
	let building = new Building();

	try {
		city.addBuilding({building:building});
		throw Error("City cannot have overlapping buildings");
	} catch (e) {
		if (!(e instanceof OverlappingBuildingError)) {
			throw e;
		}
	}
});

tests.push(function testBuildingCosts() {
	let costs = [CityResource.construction(100)];
	let building = new Building({
		costs: costs
	});

	let completed = building.complete(Resource.resourcesWithMultiplier(costs, 0.5));

	if (completed) {
		throw new Error("There should be no updates");
	}
	if (building.isCompleted()) {
		throw new Error("Building should not been built yet");
	}

	if (building.progress() !== 0.5) {
		throw new Error("Building should have 50% progress");
	}

	completed = building.complete(Resource.resourcesWithMultiplier(costs, 0.5));

	if (!completed) {
		throw new Error("Building should be updated");
	}
	if (! building.isCompleted()) {
		throw new Error("Building should be built already");
	}

	try {
		building.complete(Resource.resourcesWithMultiplier(costs, 0.5));
		throw Error("Cannot continue completing something that's complete");
	} catch (e) {
		if (!(e instanceof ProjectAlreadyCompletedError)) {
			throw e;
		}
	}

});
