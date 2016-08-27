class Effect {
}

class EnablerEffect extends Effect {
  constructor({type=null, amount=0, multiplier=1} = {}) {
    super();
    this.type = type;
    this.amount = amount;
    this.multiplier = multiplier;
  }

  static cumulativeBaseEnabledAmount(type, effects) {
    let sum = 0;
    effects.forEach(function(e) {
      if (e instanceof EnablerEffect && e.type === type) {
        sum += e.amount;
      }
    });
    if (sum < 0) {
      sum = 0;
    }
    return sum;
  }

  static cumulativeEnabledMultiplier(type, effects) {
    let multiplier = 1;
    effects.forEach(function(e) {
      if (e instanceof EnablerEffect && e.type === type) {
        multiplier *= e.multiplier;
      }
    });
    return multiplier;
  }

  static enabledAmount(type, effects) {
    let amount = EnablerEffect.cumulativeBaseEnabledAmount(type, effects);
    amount *= EnablerEffect.cumulativeEnabledMultiplier(type, effects);
    return amount;
  }
}

class EnableResourceEffect extends EnablerEffect {

}
