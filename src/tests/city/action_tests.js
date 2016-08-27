tests.push(function testCharacterWithOnePotentialActionDoesIt() {
  let player = enabledCityPlayer();
  let time = 10;
  let resources = [CityResource.gold(100)];
  let action = new PlayerEarnResourceAction({
    time: time,
    resources: resources,
  });
  let character = new CityCharacter({
    actions:[action]
  });

  player.addCharacter(character);

  let updates = player.updateTime(time/4.0);
  if (updates.length != 1 || !(updates[0] instanceof PlayerEarnResourceAction)) {
    throw new Error("The action started");
  }
  if (! (character.currentAction instanceof PlayerEarnResourceAction)) {
    throw new Error("Character should be doing action");
  }

  updates = player.updateTime(time/4.0);
  if (updates.length !== 0) {
    throw new Error("Nothing new");
  }
  if (! character.currentAction instanceof PlayerEarnResourceAction) {
    throw new Error("Character should be still doing action");
  }
  if (Resource.playerCanAfford(player, resources)) {
    throw new Error("Character shoundn't have earned anything.");
  }

  updates = player.updateTime(time/2);
  /* Expected: Completed action, Earned Resources, New Action */
  if (updates.length != 3 ) {
    throw new Error("Completed action, earned resources, new action");
  }
  if (!(updates[0] instanceof PlayerEarnResourceAction && updates[2] instanceof PlayerEarnResourceAction)) {
    throw new Error("Completed action and New action");
  }
  if (!Resource.playerCanAfford(player, resources)) {
    throw new Error("Character shound have earned some resources.");
  }

  updates = player.updateTime(time * 5);
  /* In 5 cycles, the player should have 3 updates (completed, resource, new) five times */
  if (updates.length != 3 * 5) {
    throw new Error("Completed action, earned resources, new action, 5 times");
  }
});
