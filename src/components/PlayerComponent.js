import React from 'react';

import BuildMenuComponent from "../components/menu/BuildMenuComponent";
import ResearchMenuComponent from "../components/menu/ResearchMenuComponent";
import SaveMenuComponent from "../components/menu/SaveMenuComponent";
import ResourceDisplay from "../components/menu/resources/ResourceDisplayComponent";
import CharacterDisplay from "../components/menu/characters/CharacterDisplayComponent";
import CityDisplayComponent from "../components/CityDisplayComponent";

var Player = (props) => {
  return (
    <div id={props.player.id}>
      <div
        style={{
        'zIndex': 1,
        'position': 'relative',
        'background': 'white',
        'width': 400
      }}>
        <SaveMenuComponent player={props.player}/>
        <BuildMenuComponent player={props.player}/>
        <ResearchMenuComponent player={props.player}/>
        <ResourceDisplay player={props.player} data={props.player}/>
        <CharacterDisplay player={props.player} data={props.player}/>
      </div>
      <CityDisplayComponent player={props.player}/>
    </div>
  )
}

export default Player
