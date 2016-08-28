var React = require('react');

var Resource = require('../ResourceComponent.jsx').default;

var ResourceDisplay = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    let resources = this.props.data.resources;
    let resourcesComponents = Object.keys(resources).map(function(key) {
      return <Resource key={key} data={ new Resource(key, resources[key]) } />;
    });
    return(
      <div id='resource-display' className='hud-window'>
        <span>ResourceDisplay</span>
        <resources>
          {resourcesComponents}
        </resources>
      </div>
    )
  }
});

export default ResourceDisplay;
