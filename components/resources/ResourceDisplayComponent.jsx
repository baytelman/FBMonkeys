const React = require('react');
const ResourceSummary = require('./ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let resources = Object.values(this.props.player.resources);
    return (
      <div id='resource-display' className='hud-window'>
        <b>Resources</b>
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
