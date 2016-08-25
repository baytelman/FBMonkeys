let resourceType = "resource";

let enabledPlayer = function() {
  return new Player({
    name: "Name"
  });
};

tests.push(function testResourcesBasicTests() {
  let player = enabledPlayer();
  let resource = new Resource(resourceType, 100);
  if (player.getResourceAmountForType(resourceType) > 0) {
    throw new Error("Player starts with no resources");
  }
  player.earnResource(resource);
  if (player.getResourceAmountForType(resourceType) != 100) {
    throw new Error("Player just earned 100");
  }

  let moreResources = resource.resourceWithMultiplier(2);
  if (moreResources.amount != 200) {
    throw new Error("Wrong resourceWithMultiplier output");
  }
});

tests.push(function testResourceConsumingAction() {
  let actionCalled = false;
  let resources = [ new Resource(resourceType, 100) ];

  let player = enabledPlayer();
  let action = new ResourceConsumingAction(
    "Action",
    function() { return true; },
    function() { return resources; },
    function() { actionCalled = true; }
  );
  if (action.isAffordable(player)) {
    throw new Error("Player cannot afford");
  }
  try {
    action.executeForPlayer(player);
    throw Error("Player cannot afford");
  } catch (e) {
    if (!(e instanceof InsuficientResourcesError)) {
      throw e;
    }
  }

  player.earnResources(resources);
  action.executeForPlayer(player);
  if (!actionCalled) {
    throw new Error("Action did not take place");
  }

  if (action.isAffordable(player)) {
    throw new Error("Player cannot afford it twice");
  }
});
