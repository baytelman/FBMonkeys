
function testPlayerSetup(obj) {
    obj.player = new CityPlayer("test_player");
}

tests.push(function testResourcesBasicTests() {
    let obj = {};
    testPlayerSetup(obj);
    if (obj.player.getResourceAmountForType(kResourceGold) > 0) {
        throw new Error("Player starts with no resources");
    }
    obj.player.earnResource(Resource.gold(100));
    if (obj.player.getResourceAmountForType(kResourceGold) != 100) {
        throw new Error("Player just earned 100");
    }

    let moreGold = Resource.gold(100).resourceWithMultiplier(2);
    if (moreGold.amount != 200) {
        throw new Error("Wrong resourceWithMultiplier output");
    }
});

tests.push(function testResourceConsumingAction() {
    let actionCalled = false;
    let resources = [ Resource.gold(100) ];

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
