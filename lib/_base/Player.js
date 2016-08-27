var UUIDjs = require('uuid-js');

var EffectJS = require('./Effect.js');

var EnableResourceEffect = EffectJS.EnableResourceEffect;

export class Player {
  constructor({name="PlayerName", resources={}, effects=[]} = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.name = name;

    /* Copy effects, because we will mutate them (start time) */
    this.effects = effects.map(MutableObject.mutableCopy);
    this.resources = resources;
  }
  updateTime(deltaSeconds) {
    this.time += deltaSeconds;
    return [];
  }
  /* Resources */
  earnResources(resources) {
    let player = this;
    resources.forEach(function(r) {
      player.earnResource(r);
    });
  }
  earnResource(resource) {
    if (!this.resources[resource.type]) {
      this.resources[resource.type] = 0;
    }
    this.resources[resource.type] += resource.amount;

    let amount = EnableResourceEffect.enabledAmount(resource.type, this.effects);
    if (this.resources[resource.type] > amount) {
      this.resources[resource.type] = amount;
    }
  }
  spendResource(resource) {
    if (resource.amount > 0) {
      if (!this.resources[resource.type] || this.resources[resource.type] < resource.amount) {
        throw new InsuficientResourcesError();
      }
      this.resources[resource.type] -= resource.amount;
    }
  }
  getResourceAmountForType(type) {
    if (!this.resources[type]) {
      return this.resources[type] = 0;
    }
    return this.resources[type];
  }
}
