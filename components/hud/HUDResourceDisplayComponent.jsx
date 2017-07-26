const React = require('react');
const ResourceIcon = require('../resources/ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  render: function () {
    let capacity = this
      .props
      .player
      .getCapacity();
    let resources = Object.values(this.props.player.resources);
    return (
      <div id='resource-display' className='hud-window'>
        <span>ResourceDisplay</span>
        <resources className='resources'>
          {resources.map((resource) => (resource.amount && <ResourceIcon
            key={resource.id}
            name={resource.type}
            amount={resource.amount}
            max={capacity[resource.type]}/>))}
        </resources>
      </div>
    );
  }
});

export default ResourceDisplay;
