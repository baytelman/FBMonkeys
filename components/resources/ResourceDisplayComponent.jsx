const React = require('react');
const ResourceIcon = require('./ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let resources = Object.values(this.props.player.resources);
    return (
      <div id='resource-display' className='hud-window'>
        <span>Resources</span>
        <resources className='resources'>
          {resources.map((resource) => (resource.amount && <ResourceIcon
            key={resource.id}
            resource={resource}
            max={capacity[resource.type]}/>))}
        </resources>
      </div>
    );
  }
});

export default ResourceDisplay;
