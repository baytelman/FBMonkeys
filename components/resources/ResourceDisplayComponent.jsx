const React = require('react');
const ResourceSummary = require('./ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let resources = Object.values(this.props.player.resources);
    let season = this.props.player.city.seasonPermanentEffect ? this.props.player.city.seasonPermanentEffect.description() : "";
    return (
      <div id='resource-display' className='hud-window'>
        <b>Resources ({season})</b>
        <resources className='resources'>
          {resources.map((resource) => (resource.amount && <ResourceSummary
            key={resource.id}
            resource={resource}
            max={capacity[resource.namespace]}/>))}
        </resources>
      </div>
    );
  }
});

export default ResourceDisplay;
