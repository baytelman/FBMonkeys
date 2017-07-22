const UUIDjs = require('uuid-js');

const ResourceJS = require('./CityResource');
const UtilsJS = require('./utils/Utils.js');
const MutableObject = UtilsJS.MutableObject;

const CityResource = ResourceJS.CityResource;
const ResourceConsumingAction = ResourceJS.ResourceConsumingAction;

const CityEvent = require('./CityEvent.js').CityEvent;

export class ProjectAlreadyCompletedError extends Error {

}

export class Building {
  constructor({ name = "City Hall", namespace = null, requirements = [], costs = [], time = 0, effects = [] } = { }) {
    this.id = UUIDjs.create().toString();
    this.name = name;
    this.namespace = namespace || name.toLowerCase().replace(" ", "_");

    this.requirements = requirements;
    this.costs = costs;
    this.buildingTime = time;
    /* Copy effects, because we will mutate them (start time) */
    this.effects = effects;

    this.time = 0;
  }

  toString() {
    return this.name + " (" + this.id + ") [" + (this.isCompleted()? "Producing":"Building") + "]";
  }
  getStatus() {
    if (this.isCompleted()) {
      if (this.effects.length > 0) {
        return this.effects[0].getStatus();
      } else {
        return "";
      }
    } else {
      return "[" + Math.round(this.progress()*100) + "% Complete]";
    }
  }

  progress() {
    if (this.time >= this.buildingTime) {
      return 1;
    }
    return this.time / this.buildingTime;
  }

  isCompleted() {
    return this.progress() >= 1;
  }

  updateTime(deltaSeconds, parents) {
    MutableObject.checkIsMutable(this);
    parents = Object.assign(parents, { project: this });
    let updated = [];

    let wasCompleted = this.isCompleted();

    this.time += deltaSeconds;
    this.time = Math.round(this.time*100)/100;

    if (this.isCompleted()) {
      if (!wasCompleted) {
        this.effects = this.effects.map(MutableObject.mutableCopy);
        updated.push(new CityEvent({
          type: CityEvent.kBuildingCompletedEvent,
          object: this
        }));
        deltaSeconds = this.time - this.buildingTime;
      }

      this.effects.forEach(function(effect) {
        let effectUpdate = effect.updateTime(deltaSeconds, parents);
        updated = updated.concat(effectUpdate);
      });
    } else {
      updated.push(new CityEvent({
        type: CityEvent.kBuildingProgressEvent,
        object: this
      }));
    }

    return updated;
  }
}

export class BuildingConstructionAction extends ResourceConsumingAction {
  constructor({ building, location }) {
    super(
      "Build",
      function(player) {
        return player.fulfillsRequirements(building.requirements);
      },
      function(player) { return building.costs; },
      function(player) {
        player.city.planBuilding({
          building: building,
        });
      }
    );
  }
}
