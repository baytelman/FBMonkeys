
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
