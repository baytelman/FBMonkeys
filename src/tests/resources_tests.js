
function testPlayerSetup(obj) {
    obj.player = new CityPlayer("test_player");
}

tests.push(function testResourcesBasicTests() {
    let obj = {};
    let type = 'resource';
    let resource = new Resource('resource', 100);
    testPlayerSetup(obj);
    if (obj.player.getResourceAmountForType(type) > 0) {
        throw new Error("Player starts with no resources");
    }
    obj.player.earnResource(resource);
    if (obj.player.getResourceAmountForType(type) != 100) {
        throw new Error("Player just earned 100");
    }

    let moreResources = resource.resourceWithMultiplier(2);
    if (moreResources.amount != 200) {
        throw new Error("Wrong resourceWithMultiplier output");
    }
});

tests.push(function testResourceConsumingAction() {
    let actionCalled = false;
    let resources = [ new Resource('resource', 100) ];

    let player = new CityPlayer("Name");
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
