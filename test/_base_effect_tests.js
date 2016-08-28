var assert = require('chai').assert
var EffectJS = require('../lib/_base/Effect.js');
var EnablerEffect = EffectJS.EnablerEffect;

describe('Effects', () => {
  let effectType = "type";
  let effectAmount = 100;
  let effectMultiplier = 1.5;

  it('have amounts', () => {
    let effect = new EnablerEffect({type:effectType, amount:effectAmount});
    let amount = EnablerEffect.enabledAmount(effectType, [effect]);

    assert.strictEqual(amount, effectAmount);

    let effect2 = new EnablerEffect({type:effectType, multiplier:effectMultiplier});
    let amount2 = EnablerEffect.enabledAmount(effectType, [effect2]);
    assert.strictEqual(amount2, 0, "No base");

    let amount3 = EnablerEffect.enabledAmount(effectType, [effect, effect2]);
    if (amount3 != effectAmount * effectMultiplier) {
      throw new Error("Combined effects");
    }

    let effect3 = new EnablerEffect({type:effectType, amount:effectAmount, multiplier:effectMultiplier});
    let amount4 = EnablerEffect.enabledAmount(effectType, [effect, effect2, effect3]);

    assert.strictEqual(amount4, (effectAmount+effectAmount) * effectMultiplier * effectMultiplier);
  });
});
