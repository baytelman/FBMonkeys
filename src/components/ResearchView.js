import React, { Component } from 'react';
import { kAvailableResearchChangedEvent } from '../controller/CityEvent';
import CityPlayer from '../controller/CityPlayer';
import { ScheduleResearchProjectAction } from '../controller/CityResearchProject';

class ResearchMenu extends Component {
  state = {
    availableResearch: [],
    researchedProjects: [],
    researchProjects: []
  };

  reset = () => {
    this.setState({
      player: null,
      availableResearch: [],
      researchedProjects: [],
      researchProjects: []
    });
  };

  onUpdate = events => {
    if (events && events.length) {
      this.setState(prev => {
        for (let event of events) {
          switch (event.type) {
            case kAvailableResearchChangedEvent:
              prev.player = CityPlayer.mockPlayer({
                resources: event.player.resources,
                buildings: event.player.city.buildings,
                researchedProjects: event.player.researchedProjects
              });
              prev.availableResearch = event.data.availableResearch;
              prev.researchedProjects = event.data.researchedProjects;
              prev.researchProjects = event.data.researchProjects;
              break;
            default:
              break;
          }
        }
        return prev;
      });
    }
  };

  render() {
    if (
      this.state.availableResearch.length +
        this.state.researchedProjects.length +
        this.state.researchProjects.length ===
      0
    ) {
      return null;
    }

    let effectsDescription = effects =>
      effects.length > 0 && effects.map(c => '- ' + c.getDescription()).join('\n');

    let ongoingResearch = this.state.researchProjects.map(project => (
      <button
        key={'btn_bld_' + project.id}
        disabled={true}
        className="build-entity"
        title={effectsDescription(project.permanentEffects) || null}>
        {project.getDescription()}
      </button>
    ));

    let completedResearch = this.state.researchedProjects.map(project => (
      <button
        key={'btn_bld_' + project.id}
        disabled={true}
        className="build-entity"
        title={effectsDescription(project.permanentEffects) || null}>
        {project.getDescription()}
      </button>
    ));

    let researchComponents = this.state.availableResearch.map(project => {
      const action = new ScheduleResearchProjectAction({ project: project });

      const cost = action.cost(this.state.player);
      const costsDescription =
        cost.length > 0 && 'Cost:\n' + cost.map(c => '[' + c.toString() + ']').join(' + ');
      const effects = effectsDescription(action.project.permanentEffects);
      const title =
        ((action.project.description && action.project.description + '\n...\n') || '') +
        (costsDescription || '') +
        (effects ? '\n⋯\nEffects:\n' + effects : '');

      return (
        <button
          key={'btn_bld_' + project.id}
          disabled={!action.isAffordable(this.state.player)}
          onClick={() => this.props.onScheduleResearch(project.namespace)}
          title={title}>
          {project.name}
        </button>
      );
    });

    return (
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          padding: 10,
          border: '2px solid rgba(0, 0, 0, .5)',
          background: 'rgba(255, 255, 255, .8)',
          borderRadius: 10
        }}>
        <b>Research</b>
        <div>
          {researchComponents}
          {ongoingResearch}
          {completedResearch}
        </div>
      </div>
    );
  }
}

export default ResearchMenu;
