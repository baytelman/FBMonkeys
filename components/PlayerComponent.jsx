var React = require('react');

var Resource = require('./ResourceComponent.jsx').default;

var Player = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    let resources = this.props.data.resources;
    let resourcesComponents = Object.keys(resources).map(function(key) {
      return <Resource key={key} data={ new Resource(key, resources[key]) } />;
    });
    return(
      <player id={this.state.id}>
        <name>{this.state.name}</name>
        <time>{Math.round(this.state.time)}</time>
        <resources>
          {resourcesComponents}
        </resources>
      </player>
    )
  }
});

export default Player;
