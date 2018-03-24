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

var CityDisplay = (props) => {
  const player = props.player;
  const collectFromBuilding = (building) => building.collectResources(player);
  const buildings = Object
    .values(player.city.buildings)
    .map((b, index) => {
      let {x, y} = spiral(index);
      return <div
        key={b.id}
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
          key={b.id + "_cell"}
          style={{
          position: 'absolute',
          backgroundColor: '#C83',
          WebkitClipPath: 'polygon(0% 50%, 50% 100%, 100% 50%, 50% 0%)',
          width: kCellWidth,
          height: kCellWidth / 2,
          zIndex: 0
        }}></div>
        <div
          key={b.id + "_icon"}
          className={b.namespace.replace(/\./g, '-')}
          style={{
          opacity: b.progress(),
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
            key={b.id + "_info"}
            style={{
            position: 'absolute',
            bottom: 0,
            width: '100%'
          }}>
            <div
              key={b.id + "_name"}
              style={{
              'marginRight': 'auto',
              'marginLeft': 'auto'
            }}>
              {b.name}
            </div>
            <div
              key={b.id + "_status"}
              style={{
              'marginRight': 'auto',
              'marginLeft': 'auto'
            }}>
              {b.getStatus()}
            </div>
          </div>
        </div>
        {b.getStoredResources() && (
          <div
            key={b.id + "_collect"}
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: kCellWidth,
            height: kCellWidth / 2,
            zIndex: 1
          }}>
            <a
              key={b.id + "_collect_link"}
              onClick={() => b.canCollectResources(player)
              ? collectFromBuilding(b)
              : null}
              style={{
              position: 'default'
            }}>
              {b
                .getStoredResources()
                .map(r => <collect
                  key={b.id + "_" + r.namespace + "_collect"}
                  style={{
                  opacity: b.canCollectResources(player)
                    ? 1
                    : 0.75
                }}>
                  {ResourceIcon(r.namespace)}
                </collect>)
}
            </a>
          </div>
        )
}
      </div>
    });
  return (
    <div
      style={{
      position: 'absolute',
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