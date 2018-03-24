import React from 'react'
import ResourceSummary  from './ResourceIconComponent';

var ResourceDisplay = (props) => {
  let resources = Object.values(props.player.resources);
  if (resources.length === 0) {
    return null;
  }
  let capacity = props
    .player
    .getCapacity();
  let season = props.player.city.seasonPermanentEffect
    ? props
      .player
      .city
      .seasonPermanentEffect
      .description()
    : "";
  return (
    <div id='resource-display' className='hud-window'>
      <b>Resources ({season})</b>
      <resources className='resources'>
        {resources.map((resource) => (resource.amount && <ResourceSummary
          key={resource.id}
          resource={resource}
          max={capacity[resource.namespace]}/>))}
      </resources>
    </div>
  );
}

export default ResourceDisplay;
