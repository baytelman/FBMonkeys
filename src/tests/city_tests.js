
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

tests.push(function testBuildABuilding() {

	let resource = Resource.gold(100);
    let player = new Player()

	let city = new City();
	let building = new Building({
		costs: [resource]
	});

	let action = new BuildingConstructionAction({
		city: city,
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
