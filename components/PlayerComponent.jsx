import React from 'react';

import BuildMenuComponent from "../components/menu/BuildMenuComponent.jsx";
import ResearchMenuComponent from "../components/menu/ResearchMenuComponent.jsx";
import SaveMenuComponent from "../components/menu/SaveMenuComponent.jsx";
import ResourceDisplay from "../components/menu/resources/ResourceDisplayComponent.jsx";
import CharacterDisplay from "../components/menu/characters/CharacterDisplayComponent.jsx";
import CityDisplayComponent from "../components/CityDisplayComponent.jsx";

var Player = React.createClass({
  render: function () {
    return (
      <div id={this.props.player.id}>
        <div
          style={{
          'zIndex': 1,
          'position': 'relative',
          'background': 'white',
          'width': 400
        }}>
          <SaveMenuComponent player={this.props.player}/>
          <BuildMenuComponent player={this.props.player}/>
          <ResearchMenuComponent player={this.props.player}/>
          <ResourceDisplay player={this.props.player} data={this.props.player}/>
          <CharacterDisplay player={this.props.player} data={this.props.player}/>
        </div>
        <CityDisplayComponent player={this.props.player}/>
      </div>
    );
  }
});

export default Player;
