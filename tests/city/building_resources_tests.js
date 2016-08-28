

tests.push(function testBuildingCreatingResources() {
  let resources = [CityResource.gold(100)];
  let time = 10;
  let building = new Building({
    effects:[
      new PlayerEarnResourceEffect({
        resources:resources,
        frequency:time
      })
    ],
  });
  let city = new City({
    defaultBuilding: building
  });
  let player = enabledCityPlayer(city);
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

tests.push(function testBuildActionCost() {
  let resource = CityResource.gold(100);
  let player = enabledCityPlayer();
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
  let resource = CityResource.gold(100);
  let player = enabledCityPlayer();
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
