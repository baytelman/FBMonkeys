
tests.push(function testNewCityHasOneBuilding() {
	let city = new City();

	let count = city.buildings.length;
	if (count != 1) {
		throw new Error("City starts with one building");
	}

	let location = city.buildings[0].location;
	if (!location.isEqualTo(new SquareCoordinate(0,0))) {
		throw new Error("City's first building is always in the center");
	}
});

tests.push(function testBuildAction() {
	let resource = Resource.gold(100);
    let player = new Player();
	let building = new Building({
		costs: [resource]
	});

	let action = new BuildingConstructionAction({
		city: player.city,
		building: building,
		location: new SquareCoordinate(0,0)
	});

    if (action.isAffordable(player)) {
        throw new Error("Player cannot afford this yet");
    }
    
    player.earnResource(resource);

    if (!action.isAffordable(player)) {
        throw new Error("Player can afford this yet");
    }
});

tests.push(function testBuildingTime() {
	let timeRequired = 100;
    let player = new Player();
	let building = new Building({
		buildTime: timeRequired
	});

	player.city.addBuilding({
		building: building
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
