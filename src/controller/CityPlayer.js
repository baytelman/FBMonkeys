import UUIDjs from 'uuid-js';

import { MutableObject } from './utils/Utils';

import City from './City';
import CityEvent, {
  kResearchScheduledEvent,
  kEarnResourceEvent
} from './CityEvent';
import { PeriodicEffect, ResourceEffect } from './Effect';
import { CityResource, InsuficientResourcesError } from './CityResource';

class CityPlayer {
  constructor({
    name = 'PlayerName',
    initialResources = [],
    initialCapacity = {},
    characterFactories = {},
    researchedProjects = [],
    city = null,
    seasonPeriod = 60,
    seasonAffectedResource
  } = {}) {
    this.id = UUIDjs.create().toString();
    this.time = 0;
    this.name = name;
    this.resources = {};
    this.initialCapacity = initialCapacity;
    this.characterFactories = characterFactories;
    this.city =
      city ||
      new City({
        seasonAffectedResource: seasonAffectedResource,
        seasonPeriod: seasonPeriod
      });

    this.fulfilledRequirements = {};
    this.researchProjects = [];
    this.researchedProjects = researchedProjects;

    if (initialResources && initialResources.length) {
      this.earnResources(initialResources);
    }
  }

  static mockPlayer = ({ buildings, resources, researchedProjects }) => {
    const player = new CityPlayer({
      researchedProjects,
      city: new City({ buildings })
    });
    player.resources = resources;
    return player;
  };

  updateTime(deltaSeconds) {
    this.time += deltaSeconds;

    let updated = [];
    while (deltaSeconds > 0) {
      let parents = {
        player: this,
        permanentEffects: this.getActivePermamentEffects()
      };
      let d = Math.min(deltaSeconds, CityPlayer.timeGranularity);
      updated = updated.concat(this.city.updateTime(d, parents));
      deltaSeconds -= d;
    }
    return updated;
  }

  /* Resources */
  canEarnAnyResources(resources) {
    let capacity = this.getCapacity();
    const canEarn = resources
      .map(
        r =>
          capacity[r.namespace] &&
          capacity[r.namespace] >
            ((this.resources[r.namespace] &&
              this.resources[r.namespace].amount) ||
              0)
      )
      .some(can => can);
    return canEarn;
  }
  earnResources(resources) {
    let player = this;
    let capacity = player.getCapacity();

    resources.forEach(function(resource) {
      if (!player.resources[resource.namespace]) {
        player.resources[resource.namespace] = new CityResource(
          resource.namespace,
          0
        );
      }
      let max = capacity[resource.namespace] || 0;
      player.resources[resource.namespace].amount = Math.min(
        max,
        resource.amount + (player.resources[resource.namespace].amount || 0)
      );
    });
  }
  canAfford(cost) {
    var canAfford = true;
    CityResource.aggregateSameTypeResources(cost).forEach(cost => {
      var r = this.getResourceAmountForType(cost.namespace);
      if (r < cost.amount) {
        canAfford = false;
      }
    });
    return canAfford;
  }
  spendResources(cost) {
    let canAfford = true;
    cost = CityResource.aggregateSameTypeResources(cost);
    cost.forEach(c => {
      if (this.getResourceAmountForType(c.namespace) < c.amount) {
        canAfford = false;
      }
    });
    if (!canAfford) {
      throw new InsuficientResourcesError();
    }
    cost.forEach(c => {
      this.resources[c.namespace].amount -= c.amount;
    });
  }
  getResourceAmountForType(namespace) {
    return (this.resources[namespace] && this.resources[namespace].amount) || 0;
  }
  getCapacity() {
    let capacity = {
      additions: Object.assign({}, this.initialCapacity)
    };

    let permanentEffects = this.getActivePermamentEffects(
      CapacityGrantingEffect
    );
    permanentEffects.forEach(effect => effect.combine(capacity));

    let multiplied = {};
    Object.entries(capacity.additions).forEach(([key, value]) => {
      multiplied[key] =
        (value || 0) *
        (1 + ((capacity.multipliers && capacity.multipliers[key]) || 0));
    });

    return multiplied;
  }

  /* Research */
  scheduleResearch(project) {
    this.researchProjects.push(MutableObject.mutableCopy(project));
    let event = new CityEvent({
      type: kResearchScheduledEvent,
      object: this,
      data: this.project
    });
    return event;
  }

  canEarnAnyResearch() {
    return this.researchProjects.length > 0;
  }
  earnResearch(time) {
    let updated = [];
    let parents = {
      player: this
    };
    while (this.researchProjects.length > 0 && time > 0) {
      const project = this.researchProjects[0];
      let remaining = project.remainingTime();
      if (remaining <= time) {
        this.researchedProjects.push(this.researchProjects.shift());
        updated = updated.concat(project.updateTime(remaining, parents));
        time -= remaining;
      } else {
        updated = updated.concat(project.updateTime(time, parents));
        time = 0;
      }
    }
    return updated;
  }

  /* Effects */
  getActivePermamentEffects(type) {
    let effects = [];

    /* From Research */
    this.researchedProjects.forEach(p =>
      p.permanentEffects
        .filter(effect => !type || effect instanceof type)
        .forEach(effect => effects.push(effect))
    );

    /* From City */
    effects = effects.concat(this.city.getActivePermamentEffects(type));

    /* From Buildings */
    Object.values(this.city.buildings)
      .filter(b => b.isCompleted())
      .forEach(b =>
        b.permanentEffects
          .filter(effect => !type || effect instanceof type)
          .forEach(effect => effects.push(effect))
      );
    return effects;
  }

  /* Requirements */
  getAchievements({ completedOnly = true } = {}) {
    let achievements = {};
    const addAchievement = (ns, a) =>
      (achievements[ns] = a + (achievements[ns] || 0));
    /* Resources */
    Object.values(this.resources).forEach(r =>
      addAchievement(r.namespace, r.amount)
    );
    /* Research */
    this.researchedProjects.forEach(r => addAchievement(r.namespace, 1));
    /* Buildings */
    Object.values(this.city.buildings)
      .filter(b => b.namespace && (!completedOnly || b.isCompleted()))
      .forEach(b => addAchievement(b.namespace, 1));
    return achievements;
  }
  fulfillsRequirements(namespace, requirements, multiplier) {
    let namespaceX = namespace + (multiplier || '');
    if (this.fulfilledRequirements[namespaceX]) {
      return true;
    }
    let achievements = this.getAchievements();
    let fullfills = multipleRequirement => {
      let namespace = multipleRequirement[0];
      let amount = multipleRequirement[1];
      return (achievements[namespace] || 0) >= amount * (multiplier || 1);
    };
    if (
      requirements.every(
        req => (req instanceof Array ? fullfills(req) : fullfills([req, 1]))
      )
    ) {
      if (namespace) {
        this.fulfilledRequirements[namespaceX] = true;
      }
      return true;
    }
    return false;
  }
}

CityPlayer.timeGranularity = 0.25;

const BLOCKED_COLLECT_NO_CAPACITY = 'No capacity left';
export class PlayerEarnResourceEffect extends PeriodicEffect {
  constructor({ resources = [], ...params } = {}) {
    const { requirements } = params;
    super({
      name: 'Grant',
      namespace:
        'generic.effect.player.resource.earned-' + JSON.stringify(requirements),
      ...params
    });
    this.resources = resources;
  }
  shouldBeBlocked(parents) {
    return (
      !parents.player.canEarnAnyResources(this.resources) &&
      BLOCKED_COLLECT_NO_CAPACITY
    );
  }
  trigger(parents) {
    let event = new CityEvent({
      type: kEarnResourceEvent,
      object: this,
      data: this.resources
    });
    parents.player.earnResources(this.resources);
    return [event];
  }
  getDescription() {
    return (
      'Gives ' +
      this.resources.map(r => r.toString()).join(' + ') +
      ' every ' +
      this.period +
      ' sec'
    );
  }
}

export class CapacityGrantingEffect extends ResourceEffect {
  constructor(params) {
    super({ name: 'Capacity', ...params });
  }
  getName() {
    return 'Capacity';
  }
}

export default CityPlayer;
