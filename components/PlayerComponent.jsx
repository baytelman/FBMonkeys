const React = require('react');

const BuildMenuComponent = require("../components/menus/BuildMenuComponent.jsx").default;
const SaveMenuComponent = require("../components/menus/SaveMenuComponent.jsx").default;
const ResourceDisplay = require("../components/resources/ResourceDisplayComponent.jsx").default;
const CityDisplayComponent = require("../components/CityDisplayComponent.jsx").default;

var Player = React.createClass({
  render: function() {
    return(
      <div id={this.props.player.id}>
      <div style={{
        'zIndex': 1,
        'position': 'relative',
        'background': 'white',
        'width': 400,
      }}>
        <ResourceDisplay player={this.props.player} data={this.props.player} />
        <BuildMenuComponent player={this.props.player}/>
        <SaveMenuComponent player={this.props.player}/>
      </div>
      <CityDisplayComponent player={this.props.player}/>
      </div>
    );
  },
});

export default Player;
