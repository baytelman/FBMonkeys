
function testPlayerSetup(obj) {
    obj.player = new Player("test_player");
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

// tests.push(function testHealTests() {
//     let obj = {};
//     testArmySetup(obj);
//
//     let hca = new HealCharacterAction(obj.m);
//     let c = hca.costs();
//     obj.m.receiveDamage(obj.m.maxHealth());
//     if (c.length != 1 || c[0].type != kResourceGold || c[0].amount <= 0) {
//         throw new Error("Wrong cost to heal");
//     }
//     if (Resource.playerCanAfford(obj.player, c)) {
//         throw new Error("Player cannot afford");
//     }
//     try {
//         hca.executeForPlayer(obj.player);
//         throw Error("Player cannot afford");
//     } catch (e) {
//         if (!(e instanceof InsuficientResourcesError)) {
//             throw e;
//         }
//     }
//
//     obj.player.earnResources(c);
//     hca.executeForPlayer(obj.player);
//     if (obj.m.health < obj.m.maxHealth()) {
//         throw new Error("Healing action did not take place");
//     }
//
//     if (Resource.playerCanAfford(obj.player, c)) {
//         throw new Error("Player cannot afford it twice");
//     }
// });
//
