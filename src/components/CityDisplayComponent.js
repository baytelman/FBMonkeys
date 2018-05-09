import React from 'react'
import {ResourceIcon} from './menu/resources/ResourceIconComponent';

let _spiralCache = {}
let spiral = function (index) {
  /*
    6 7 8 9
    5 0 1 A
    4 3 2 B
    F E D C
    */

  if (_spiralCache[index]) 
    return _spiralCache[index];
  
  let length = 1;
  let location = {
    x: 0,
    y: 0
  };
  let direction = 0;
  for (var i = 0; i < index;) {
    for (var l = 0; l < length && i < index; ++l && ++i) {
      if (direction === 0) 
        location.x++;
      else if (direction === 1) 
        location.y++;
      else if (direction === 2) 
        location.x--;
      else if (direction === 3) 
        location.y--;
      }
    direction = (direction + 1) % 4;
    if (direction % 2 === 0) {
      length++;
    }
  }

  return _spiralCache[index] = location;
};

let kCellWidth = 120;
let kAssetWidth = 80;
let kCellSpacing = 30;

const ResourcesDisplay = ({building, player, resources}) => (resources && <div
  key={building.id + "_collect"}
  style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: kCellWidth,
  height: kCellWidth / 2,
  zIndex: 1
}}>
  <a
    key={building.id + "_collect_link"}
    onClick={() => building.canCollectResources(player)
    ? building.collectResources(player)
    : null}
    style={{
    position: 'default'
  }}>
    {resources.map(r => <div
      className="collect"
      key={building.id + "_" + r.namespace + "_collect"}
      style={{
      opacity: building.canCollectResources(player)
        ? 1
        : 0.75
    }}>
      {ResourceIcon(r.namespace)}
    </div>)
}
  </a>
</div>)

const BuildingDisplay = ({building, x, y, player}) => {
  return (
    <div
      key={building.id}
      style={{
      position: 'absolute',
      left: (x + y - 0.5) * (kCellWidth + kCellSpacing) / 2,
      top: (y - x - 0.5) * (kCellWidth / 2 + kCellSpacing / 2) / 2,
      zIndex: 10 + y - x,
      fontSize: '8px',
      lineHeight: '12px',
      align: 'center',
      textAlign: 'center'
    }}>
      <div
        key={building.id + "_cell"}
        style={{
        position: 'absolute',
        backgroundColor: '#C83',
        WebkitClipPath: 'polygon(0% 50%, 50% 100%, 100% 50%, 50% 0%)',
        width: kCellWidth,
        height: kCellWidth / 2,
        zIndex: 0
      }}></div>
      <div
        key={building.id + "_icon"}
        className={building
        .namespace
        .replace(/\./g, '-')}
        style={{
        opacity: building.progress(),
        position: 'absolute',
        top: (kAssetWidth - kCellWidth) / 2 - 10,
        left: (kCellWidth - kAssetWidth) / 2,
        whiteSpace: 'nowrap',
        width: kAssetWidth,
        height: kAssetWidth,
        zIndex: 1,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain'
      }}>
        <div
          key={building.id + "_info"}
          style={{
          position: 'absolute',
          bottom: 0,
          width: '100%'
        }}>
          <div
            key={building.id + "_name"}
            style={{
            'marginRight': 'auto',
            'marginLeft': 'auto'
          }}>
            {building.name}
          </div>
          <div
            key={building.id + "_status"}
            style={{
            'marginRight': 'auto',
            'marginLeft': 'auto'
          }}>
            {building.getStatus()}
          </div>
        </div>
      </div>
      {ResourcesDisplay({
        building: building,
        player: player,
        resources: building.getStoredResources()
      })}
    </div>
  )
}

var CityDisplay = (props) => {
  const player = props.player;
  const buildings = Object
    .values(player.city.buildings)
    .map((b, index) => {
      let {x, y} = spiral(index);
      return BuildingDisplay({building: b, x: x, y: y, player: player})
    });
  return (
    <div
      style={{
      position: 'absolute',
      overflow: 'hidden',
      top: 0,
      left: 0,
      zIndex: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'lightblue'
    }}>
      <div
        style={{
        position: 'relative',
        top: '50%',
        left: '50%'
      }}>
        {buildings}
      </div>
    </div>
  );
}

export default CityDisplay;