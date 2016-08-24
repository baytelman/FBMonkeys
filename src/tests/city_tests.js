
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

tests.push(function testBuildingCreatingResources() {
	let resources = [Resource.gold(100)];
	let time = 10;
	let building = new Building({
		generateResources: resources,
		resourcesFrequency: time,
	});
	let city = new City({
		defaultBuilding: building
	});
	let player = new CityPlayer("Player", city);
	let multiplier = 4;
	let moreResources = Resource.resourcesWithMultiplier(resources, multiplier);

	if (Resource.playerCanAfford(player, moreResources)) {
		throw new Error("User has not earned resources yet");
	}

	player.updateTime(time * (multiplier - 1));

	if (Resource.playerCanAfford(player, moreResources)) {
		throw new Error("User has not earned enough resources yet");
	}

	player.updateTime(time);

	if (! Resource.playerCanAfford(player, moreResources)) {
		throw new Error("User should have enough resources");
	}
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

tests.push(function testOverLappingBuildings() {
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

tests.push(function testBuildActionCost() {
	let resource = Resource.gold(100);
	let player = new CityPlayer();
	let building = new Building({
		costs: [resource]
	});

	let action = new BuildingConstructionAction({
		building: building,
		location: new SquareCoordinate(1,0)
	});

	if (action.isAffordable(player)) {
		throw new Error("Player cannot afford this yet");
	}

	player.earnResource(resource);

	if (!action.isAffordable(player)) {
		throw new Error("Player can afford this yet");
	}

	action.executeForPlayer(player);

	if (player.city.buildings.length != 2) {
		throw new Error("City should have 2 buildings now");
	}
});

tests.push(function testBuildActionLocation() {
	let resource = Resource.gold(100);
	let player = new CityPlayer();
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
	try {
		action.executeForPlayer(player);
		throw Error("City cannot have overlapping buildings");
	} catch (e) {
		if (!(e instanceof UnavailableActionError)) {
			throw e;
		}
	}
});

tests.push(function testBuildingTime() {
	let timeRequired = 100;
	let player = new CityPlayer();
	let building = new Building({
		buildTime: timeRequired
	});

	player.city.addBuilding({
		building: building,
		location: new SquareCoordinate(1,0)
	});

	let updated = player.updateTime(timeRequired / 2);

	if (updated.length != 0) {
		throw new Error("There should be no updates");
	}
	if (building.isBuilt()) {
		throw new Error("Building should not been built yet");
	}

	if (building.buildProgress() !== 0.5) {
		throw new Error("Building should have 50% progress");
	}

	updated = player.updateTime(timeRequired / 2);

	if (updated.length != 1 || updated[0] != building) {
		throw new Error("Building should be updated");
	}
	if (! building.isBuilt()) {
		throw new Error("Building should be built already");
	}

	updated = player.updateTime(timeRequired / 2);

	if (updated.length != 0) {
		throw new Error("There should be no updates");
	}

});
