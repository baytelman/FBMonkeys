import CityProject from './CityProject';
import CityEvent from './CityEvent';
import {ResourceConsumingAction} from './CityResource';
import {FrequencyEffect} from './Effect';

export default class CityResearchProject extends CityProject {
  constructor({
    name = "Some research",
    namespace = 'research.name'
  } = {}) {
    let params = Object.assign(arguments[0] || {}, {
      name: name,
      namespace: namespace,
      completionEventType: CityEvent.kProjectCompletedEvent,
      progressEventType: CityEvent.kProjectProgressEvent
    });
    super(params);
  }
}

export class ScheduleResearchProjectAction extends ResourceConsumingAction {
  constructor({project}) {
    super("Project", function (player) {
      let unallResearch = player
        .researchProjects
        .map(r => r.namespace)
        .concat(player.researchedProjects.map(r => r.namespace));
      return unallResearch.indexOf(this.project.namespace) < 0 && player.fulfillsRequirements(this.project.namespace, this.project.requirements);
    }, function (player) {
      return this.project.cost
    }, function (player) {
      player.scheduleResearch(this.project)
    });
    this.project = project;
  }
}

export class PlayerEarnResearchEffect extends FrequencyEffect {
  constructor({
    research = 1,
    period = 1
  } = {}) {
    super(arguments[0]);
    this.research = 1;
  }
  canBegin(parents) {
    return parents
      .player
      .canEarnAnyResearch();
  }
  trigger(parents) {
    let event = new CityEvent({type: CityEvent.kEarnResearchEvent, object: this, data: this.research});
    let updated = [event];
    updated = updated.concat(parents.player.earnResearch(this.research));
    return updated;
  }
  getDescription() {
    return "Researches " + this.research + " every " + this.period + " sec";
  }
}
