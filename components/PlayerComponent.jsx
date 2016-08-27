var React = require('react');

var Resource = require('./ResourceComponent.jsx').default;

var Player = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
    }
  },
  render: function() {
    let resources = this.props.data.resources;
    let resourcesComponents = Object.keys(resources).map(function(key) {
      return <Resource key={key} data={ new Resource(key, resources[key]) } />;
    });
    return(
      <player id={this.state.data.id}>
        <name>{this.state.data.name}</name>
        <time>{Math.round(this.state.data.time)}</time>
        <resources>
          {resourcesComponents}
        </resources>
      </player>
    )
  }
});

export default Player;
