import CityProject from './CityProject';
import CityEvent, {
  kResearchProjectProgressEvent,
  kResearchProjectCompletedEvent,
  kEarnResearchEvent
} from './CityEvent';
import { ResourceConsumingAction } from './CityResource';
import { PeriodicEffect } from './Effect';

export default class CityResearchProject extends CityProject {
  constructor({
    name = 'Some research',
    description = 'Some research',
    namespace = 'research.name'
  } = {}) {
    let params = Object.assign(arguments[0] || {}, {
      name: name,
      description: description,
      namespace: namespace,
      completionEventType: kResearchProjectCompletedEvent,
      progressEventType: kResearchProjectProgressEvent
    });
    super(params);
  }
}

export class ScheduleResearchProjectAction extends ResourceConsumingAction {
  constructor({ project }) {
    super(
      'Project',
      function(player) {
        let unallResearch = player.researchProjects
          .map(r => r.namespace)
          .concat(player.researchedProjects.map(r => r.namespace));
        return (
          unallResearch.indexOf(this.project.namespace) < 0 &&
          player.fulfillsRequirements(
            this.project.namespace,
            this.project.requirements
          )
        );
      },
      function(player) {
        return this.project.cost;
      },
      function(player) {
        player.scheduleResearch(this.project);
      }
    );
    this.project = project;
  }
}

const BLOCKED_ALREADY_RESEARCHING = 'Another project is ongoing';
export class PlayerEarnResearchEffect extends PeriodicEffect {
  constructor({ research = 1, ...params } = {}) {
    super(params);
    this.research = research;
  }
  shouldBeBlocked(parents) {
    return !parents.player.canEarnAnyResearch() && BLOCKED_ALREADY_RESEARCHING;
  }
  trigger(parents) {
    let event = new CityEvent({
      type: kEarnResearchEvent,
      object: this,
      data: this.research
    });
    let updated = [event];
    updated = updated.concat(parents.player.earnResearch(this.research));
    return updated;
  }
  getDescription() {
    return 'Researches ' + this.research + ' every ' + this.period + ' sec';
  }
}
