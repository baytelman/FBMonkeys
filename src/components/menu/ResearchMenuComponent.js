import React from 'react';

import GameController from '../../lib/controller/GameController.js';

var ResearchMenu = () => {
  let controller = GameController.instance;
  let availableResearch = controller.getAvailableResearchActions()
  if (availableResearch.length + controller.player.researchedProjects.length + controller.player.researchProjects.length === 0) {
    return null;
  }

  let effectsDescription = (effects) => effects.length > 0 && effects.map((c) => "- " + c.getDescription()).join("\n")

  let ongoingResearch = controller
    .player
    .researchProjects
    .map(project => (
      <button
        key={"btn_bld_" + project.id}
        disabled={true}
        className='build-entity'
        title={effectsDescription(project.permanentEffects) || null}>
        {project.getDescription()}
      </button>
    ));

  let completedResearch = controller
    .player
    .researchedProjects
    .map(project => (
      <button
        key={"btn_bld_" + project.id}
        disabled={true}
        className='build-entity'
        title={effectsDescription(project.permanentEffects) || null}>
        {project.getDescription()}
      </button>
    ));

  let researchComponents = availableResearch.map(action => {
    let scheduleResearch = function () {
      action.executeForPlayer(controller.player);
    };
    const cost = action.cost(controller.player);
    const costsDescription = cost.length > 0 && "Cost:\n" + cost.map((c) => "[" + c.toString() + "]").join(" + ");
    const effects = effectsDescription(action.project.permanentEffects)
    const title = ((action.project.description && (action.project.description + '\n...\n')) || '') + (costsDescription || '') + (effects
      ? ("\n⋯\nEffects:\n" + effects)
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
        {researchComponents}
        {ongoingResearch}
        {completedResearch}
      </div>
    </div>
  )
}

export default ResearchMenu;
