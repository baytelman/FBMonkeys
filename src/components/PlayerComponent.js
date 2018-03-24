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
      <CityDisplayComponent player={props.player}/>
      <ResourceDisplay
        style={{
        right: 0,
        top: 0
      }}
        player={props.player}
        data={props.player}/>
      <div
        className="hud-window"
        style={{
        right: 0,
        bottom: 0
      }}>
        <ResearchMenuComponent player={props.player}/>
      </div>
      <div className="hud-window" style={{
        left: 0,
        top: 0
      }}>
        <SaveMenuComponent player={props.player}/>
        <BuildMenuComponent player={props.player}/>
      </div>
      <CharacterDisplay
        style={{
        left: 0,
        bottom: 0
      }}
        player={props.player}
        data={props.player}/>
    </div>
  )
}

export default Player
