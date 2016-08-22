
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
    let player = new Player();
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
    let player = new Player();
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
    let player = new Player();
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
