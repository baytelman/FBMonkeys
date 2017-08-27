import React from 'react';

import GameController from '../../lib/controller/GameController.js';
import CityResearchProject, {ScheduleResearchProjectAction} from '../../lib/city/CityResearchProject.js';

const availableResearchActions = Object
  .values(GameController.instance.module.availableResearch())
  .map((project) => new ScheduleResearchProjectAction({project: project}));

var ResearchMenu = React.createClass({
  render: function () {
    let _this = this;
    let controller = GameController.instance;
    let ongoingResearch = controller
      .player
      .researchProjects
      .map(project => (
        <div key={project.id}>{project.getDescription()}</div>
      ));
    let completedResearch = controller
      .player
      .researchedProjects
      .map(project => (
        <div key={project.id}>{project.getDescription()}</div>
      ));
    let researchComponents = availableResearchActions.map(action => {
      let scheduleResearch = function () {
        action.executeForPlayer(controller.player);
      };
      if (!action.isAvailable(controller.player)) {
        return null;
      }
      const cost = action.cost(controller.player);
      const costsDescription = cost.length > 0 && "Cost:\n" + cost.map((c) => "[" + c.toString() + "]").join(" + ");
      const effectsDescription = action.project.permanentEffects.length > 0 && action
        .building
        .effects
        .map((c) => "- " + c.getDescription())
        .join("\n");
      const title = costsDescription + (effectsDescription
        ? ("\n⋯\nEffects:\n" + effectsDescription)
        : '');

      return (
        <button
          key={"btn_bld_" + action.project.id}
          disabled={!action.isAffordable(controller.player)}
          className='build-entity'
          onClick={scheduleResearch}
          title={title}>
          {action.project.name}
        </button>
      );
    });

    return (
      <div id='project-menu'>
        <b>Research</b>
        <div>
          {ongoingResearch}
          {completedResearch}
          {researchComponents}
        </div>
      </div>
    )
  }
});

export default ResearchMenu;
