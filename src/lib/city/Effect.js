import UUIDjs from 'uuid-js';

import CityEvent, {
  kTaskAbortedEvent,
  kPeriodicEffectProgressEvent,
  kPeriodicEffectBlockedEvent
} from './CityEvent';

const START_CHECK_SENSITIVITY = 0.01;

class Effect {
  constructor({ name, namespace }) {
    this.id = UUIDjs.create().toString();
    this.name = name;
    this.namespace = namespace;
  }
  getName() {
    return this.name || this.constructor.name;
  }
}

export class PeriodicEffect extends Effect {
  constructor({ period = 1, requirements = [], ...params } = {}) {
    super(params);
    this.requirements = requirements;
    this.period = period;
    this.progress = 0;

    this.cycleStart = 0;
    this.time = 0;

    this.blocked = false;
  }
  shouldBeBlocked() {
    return false;
  }
  missingTime() {
    return this.cycleStart + this.period - this.time;
  }
  updateTime(deltaSeconds, parents) {
    let updated = [];
    if (this.isAvailable(parents.player)) {
      while (deltaSeconds > 0) {
        /* On effect start, let's check if we should get blocked */
        if (Math.abs(this.cycleStart - this.time) < START_CHECK_SENSITIVITY) {
          const wasItBlocked = this.blocked;
          this.blocked = this.shouldBeBlocked(parents);
          if (this.blocked) {
            if (!wasItBlocked) {
              const event = new CityEvent({
                type: kPeriodicEffectBlockedEvent,
                object: this,
                data: parents
              });
              updated = updated.concat(event);
            }
            break;
          } else {
            updated = updated.concat(this.began(parents));
          }
        }
        this.blocked = false;
        const nextStart = this.cycleStart + this.period;
        const canComplete = deltaSeconds >= nextStart - this.time;
        let partialDelta;
        if (canComplete) {
          partialDelta = nextStart - this.time;
          deltaSeconds -= partialDelta;
          this.time += partialDelta;
          this.progress = (this.time - this.cycleStart) / this.period;
          this.cycleStart += this.period;
          updated = updated.concat(this.trigger(parents));
        } else {
          this.time += deltaSeconds;
          this.progress = (this.time - this.cycleStart) / this.period;
          const event = new CityEvent({
            type: kPeriodicEffectProgressEvent,
            object: this,
            data: parents
          });
          updated = updated.concat(event);
          deltaSeconds = 0;
        }
      }
    }
    return updated;
  }
  getStatus() {
    if (this.blocked) {
      return '[Blocked]';
    }
    return '[' + Math.round(this.progress * 100) + '% Producing]';
  }
  isAvailable(player) {
    return (
      !this.requirements.length ||
      (player ? player.fulfillsRequirements(this.namespace, this.requirements) : false)
    );
  }
  began(parents) {
    return [];
  }
  trigger(parents) {
    throw Error('Must be overriden – It should return an array of CityEvents');
  }
  abort() {
    let event = new CityEvent({ type: kTaskAbortedEvent, object: this });
    return event;
  }
  toString() {
    return this.constructor.name + ' (' + this.id + ') ' + this.getStatus();
  }
  getDescription() {
    return this.toString();
  }
}

export class ResourceEffect extends Effect {
  constructor({ additions = 0, multipliers = 0, ...params } = {}) {
    super(params);
    this.additions = additions;
    this.multipliers = multipliers;
  }
  _combine(combined, local) {
    Object.entries(local).forEach(([key, value]) => {
      combined[key] = (combined[key] || 0) + value;
    });
    return combined;
  }
  combine(combinedUnits) {
    combinedUnits.additions = this._combine(combinedUnits.additions || {}, this.additions);
    combinedUnits.multipliers = this._combine(combinedUnits.multipliers || {}, this.multipliers);
    return combinedUnits;
  }
  getName() {
    return this.name || 'Generic resource effect';
  }
  getDescription() {
    let additions = Object.keys(this.additions).map(k => k + ' x ' + this.additions[k]);
    let multipliers = Object.keys(this.multipliers).map(
      k => k + ' + ' + this.multipliers[k] * 100 + '%'
    );
    return this.getName() + ': ' + [...additions, ...multipliers].join(', ');
  }
}

export class SpeedEnhancementEffect extends Effect {
  constructor({ namespaces = [], enhancement = 0, ...params } = {}) {
    super(params);
    this.enhancement = enhancement;
    this.namespaces = namespaces;
  }
  getDescription() {
    return 'Speed: +' + Math.round(this.enhancement * 100) + '%';
  }
  apply(target) {
    if (this.namespaces.indexOf(target.namespace) >= 0) {
      return this.enhancement;
    }
    return 0;
  }
  static apply(target, effects) {
    var timeMultiplier = 0;
    if (effects) {
      effects
        .filter(effect => effect instanceof SpeedEnhancementEffect)
        .forEach(effect => (timeMultiplier += effect.apply(target)));
    }
    return 1 + timeMultiplier;
  }
}
