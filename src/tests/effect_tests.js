let effectType = "type";
let effectAmount = 100;
let effectMultiplier = 1.5;

tests.push(function testEnableEffectsBasicTests() {
  let effect = new EnablerEffect({type:effectType, amount:effectAmount});
  let amount = EnablerEffect.enabledAmount(effectType, [effect]);

  if (amount != effectAmount) {
    throw new Error("Single effect should have expected amount");
  }
  let effect2 = new EnablerEffect({type:effectType, multiplier:effectMultiplier});
  let amount2 = EnablerEffect.enabledAmount(effectType, [effect2]);

  if (amount2 != 0) {
    throw new Error("Second effect has no base");
  }

  let amount3 = EnablerEffect.enabledAmount(effectType, [effect, effect2]);
  if (amount3 != effectAmount * effectMultiplier) {
    throw new Error("Combined effects");
  }

  let effect3 = new EnablerEffect({type:effectType, amount:effectAmount, multiplier:effectMultiplier});
  let amount4 = EnablerEffect.enabledAmount(effectType, [effect, effect2, effect3]);
  if (amount4 != (effectAmount+effectAmount) * effectMultiplier * effectMultiplier) {
    throw new Error("Combined effects with right order");
  }
});
