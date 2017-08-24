import CityProject from './CityProject';
import CityEvent from './CityEvent';
import {ResourceConsumingAction} from './CityResource';

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
            let unavailableResearch = player
                .researchProjects
                .map(r => r.namespace)
                .concat(player.researchedProjects.map(r => r.namespace));
            return unavailableResearch.indexOf(this.project.namespace) < 0 && player.fulfillsRequirements(this.project.namespace, this.project.requirements);
        }, function (player) {
            return this.project.cost
        }, function (player) {
            player.scheduleResearch(this.project)
        });
        this.project = project;
    }
}