const React = require('react');
const ResourceIcon = require('../resources/ResourceIconComponent.jsx').default;

var ResourceDisplay = React.createClass({
  buildChildren: function (resource) {
    if (resource.amount) {
      return (<ResourceIcon
        key={resource.id}
        name={resource.type}
        amount={resource.amount}
        max={this.props.player.initialCapacity[resource.type]}/>);
    }
    return null;
  },
  render: function () {
    let resources = Object.values(this.props.player.resources);
    return (
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
