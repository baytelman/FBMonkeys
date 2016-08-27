let resourceType = "resource";
let maxResourceDefault = 1000;

function enabledPlayer(maxResource) {
  if (!maxResource) {
    maxResource = maxResourceDefault;
  }
  return new Player({
    name: "Name",
    effects: [
      new EnableResourceEffect({
        type: resourceType,
        amount: maxResource
      })
    ]
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

  let moreResources = resource.resourceWithMultiplier(10);
  if (moreResources.amount != 1000) {
    throw new Error("Wrong resourceWithMultiplier output");
  }

  player.earnResource(moreResources);

  if (player.getResourceAmountForType(resourceType) != maxResourceDefault) {
    throw new Error("Player has more resources than he's able to.");
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
