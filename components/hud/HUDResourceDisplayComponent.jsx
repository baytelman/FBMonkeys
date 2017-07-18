const React = require('react');
const ResourceIcon = require('../resources/ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  buildChildren: function (resource) {
    return(
      <ResourceIcon key={resource.id} name={resource.type} amount={resource.amount} />
    );
  },
  render: function() {
    let resources = this.props.player.resources;
    return(
      <div id='resource-display' className='hud-window'>
        <span>ResourceDisplay</span>
        <resources className='resources'>
          {resources.map(this.buildChildren)}
        </resources>
      </div>
    );
  }
});

export default ResourceDisplay;
