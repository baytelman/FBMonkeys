const React = require('react');

const ResourceIcon = require('../resources/ResourceIconComponent.jsx').default;

const ResourceStore = require('../../stores/ResourceStore.js').default;

function getResourcesState () {
  return ResourceStore.getResources();
}

var ResourceDisplay = React.createClass({
  getInitialState: function() {
    return {
      resources: getResourcesState()
    }
  },
  updateState: function() {
    this.setState({
      resources: getResourcesState()
    });
  },
  componentWillMount: function () {
    ResourceStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ResourceStore.removeListener("change", this._onChange);
  },
  buildChildren: function (resource) {
    return(
      <ResourceIcon key={resource.id} name={resource.name} amount={resource.amount} />
    )
  },
  render: function() {
    let resources = this.state.resources;
    return(
      <div id='resource-display' className='hud-window'>
        <span>ResourceDisplay</span>
        <resources className='resources'>
          {resources.map(this.buildChildren)}
        </resources>
      </div>
    )
  },
  _onChange: function () {
    this.updateState();
  }
});

export default ResourceDisplay;
