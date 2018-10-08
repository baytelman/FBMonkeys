import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import Popup from 'reactjs-popup';

import {
  kBuildingPlannedEvent,
  kBuildingProgressEvent,
  kBuildingCompletedEvent,
  kPeriodicEffectProgressEvent,
  kAvailableAreasChangedEvent,
  kAvailableBuildingsChangedEvent,
  kEarnResourceEvent,
  kSpendResourceEvent
} from '../controller/CityEvent';
import { MutableObject, Square } from '../controller/utils/Utils';

import InPlaceNotification from './InPlaceNotification';
import ResourceIcon from './ResourceIcon';
import CityPlayer from '../controller/CityPlayer';
import { BuildingConstructionAction } from '../controller/CityBuilding';

const Geom = Square;

const GRID_WIDTH = 128.0;
const GRID_HEIGHT = GRID_WIDTH;
const getSpotLocation = ({ spot, offset }) => {
  const { x, y } = Geom.coordinates({
    ...spot,
    width: GRID_WIDTH,
    height: GRID_HEIGHT
  });
  return {
    left: (x || 0) - (offset.x || 0) - (offset.left || 0),
    top: (y || 0) - (offset.y || 0) - (offset.top || 0)
  };
};

const TileLocator = ({ spot, offset, onClick, children, style }) => {
  const { left, top } = getSpotLocation({ spot, offset });
  return (
    <div
      key={`${spot.x}-${spot.y}`}
      style={{
        position: 'absolute',
        left,
        top,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        fontSize: 9,
        ...style
      }}
      onClick={onClick}>
      {children}
    </div>
  );
};

const TileComponent = ({
  stroke = 'black',
  fill = 'yellow',
  width = 1,
  children
}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      boxSizing: 'border-box',
      backgroundColor: fill,
      borderStyle: 'solid',
      borderWidth: width,
      borderColor: stroke,
      width: GRID_WIDTH,
      height: GRID_HEIGHT
    }}
    height={GRID_HEIGHT}
    width={GRID_WIDTH}>
    {children}
  </div>
);

const AvailableSpot = ({
  spot,
  offset = { x: 0, y: 0 },
  availableBuildingActions = [],
  onPlanBuilding
}) => {
  return (
    availableBuildingActions &&
    availableBuildingActions.length > 0 && (
      <TileLocator spot={spot} offset={offset}>
        <Popup
          trigger={
            <div>
              <TileComponent
                key="tile"
                fill="rgba(0,0,0,0)"
                stroke="rgba(0,0,0, 0.5)"
                width={3}>
                🛠
              </TileComponent>
            </div>
          }
          offsetY={GRID_HEIGHT / 2}
          offsetX={-GRID_HEIGHT / 8}
          closeOnDocumentClick={true}
          overlayStyle={{ zIndex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
          position="right center">
          {availableBuildingActions.map((a, idx) => (
            <div
              key={`${idx}-${a.building.namespace}`}
              style={{
                cursor: 'pointer',
                color: a.isAffordable ? null : '#AAA'
              }}
              onClick={
                a.isAffordable
                  ? () => onPlanBuilding({ ...a.building, ...spot })
                  : null
              }>
              {a.building.name}{' '}
              {a.cost.map(r => (
                <ResourceIcon key={r.namespace} {...r} />
              ))}
            </div>
          ))}
        </Popup>
      </TileLocator>
    )
  );
};

const StoredResources = ({ resources }) =>
  resources && resources.length ? (
    <div
      key="StoredResources"
      style={{
        position: 'absolute',
        textAlign: 'right',
        right: 5,
        bottom: 5,
        display: 'inline-block',
        padding: 3,
        border: '1px solid rgba(0,0,0,0.5)',
        borderRadius: 5,
        backgroundColor: '#EEE'
      }}>
      Stored
      <div>
        {resources.map((r, idx) => (
          <ResourceIcon key={r.namespace} {...r} />
        ))}
      </div>
    </div>
  ) : null;

const Effects = ({ effects }) =>
  effects && effects.length ? (
    <div
      key="Effects"
      style={{
        position: 'absolute',
        textAlign: 'left',
        left: 5,
        bottom: 5,
        display: 'inline-block'
      }}>
      {effects.map((e, idx) => (
        <div key={e.id}>
          <div
            style={{
              marginTop: 3,
              padding: 3,
              border: '1px solid rgba(0,0,0,0.5)',
              borderRadius: 5,
              backgroundColor: '#EEE',
              display: 'inline-block'
            }}>
            {e.getName()}
            <div>
              {e.additions &&
                Object.keys(e.additions).map(namespace => (
                  <ResourceIcon
                    key={namespace}
                    namespace={namespace}
                    amount={e.additions[namespace]}
                  />
                ))}
              {e.resources &&
                e.resources.map(r => <ResourceIcon key={r.namespace} {...r} />)}
              <div style={{ display: 'inline-block', width: 12 }}>
                {e.blocked ? (
                  <span title={e.blocked} role="img" aria-label="closed lock">
                    🔒
                  </span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div style={{ border: '0.5px solid black', opacity: 0.5 }}>
              <div
                style={{
                  backgroundColor: 'black',
                  minHeight: 2,
                  width: Math.round(e.progress * 100) + '%'
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div key="Effects">No effects</div>
  );

const BuildingTile = ({
  building,
  onCollectFromBuilding,
  offset = { x: 0, y: 0 }
}) => {
  return (
    <TileLocator
      offset={offset}
      spot={building}
      style={{
        opacity: 0.2 + Math.pow(building.progress(), 2) * 0.7
      }}
      onClick={
        building.isCompleted() && building.getStoredResources()
          ? () => onCollectFromBuilding(building.id)
          : null
      }>
      <TileComponent fill="rgba(255, 255, 0, 0.3)" />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          textAlignVertical: 'center'
        }}>
        <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }}>
          {building.name} {`${building.x}-${building.y}`}
        </div>
        {building.isCompleted()
          ? [
              <StoredResources
                key="StoredResources"
                resources={building.getStoredResources()}
              />,
              <Effects
                key="Effects"
                effects={building.availablePeriodicEffects}
              />,
              <Effects key="Effects" effects={building.permanentEffects} />
            ]
          : building.getStatus()}
        <br />
      </div>
    </TileLocator>
  );
};

const DEFAULT_STATE = () => ({
  width: 0,
  height: 0,
  offset: {
    x: 0,
    y: 0
  },
  availableAreas: [],
  availableBuildings: {},
  buildings: {},
  resources: {},
  notifications: []
});

class CityView extends Component {
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    const { innerWidth, innerHeight } = window;
    this.setState({
      innerWidth,
      innerHeight
    });
  }
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  reset = async () => {
    const { innerWidth, innerHeight } = window;
    await this.setState({
      ...DEFAULT_STATE(),
      innerWidth,
      innerHeight
    });
  };

  componentDidMount = () => {
    this.updateWindowDimensions();
    const { innerWidth, innerHeight } = window;
    this.setState({
      offset: {
        innerWidth,
        innerHeight
      }
    });
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  removeNotification = event => {
    this.setState(prev => {
      prev.notifications = prev.notifications.filter(e => e !== event);
      return prev;
    });
  };

  computeBuildingActions = ({
    availableBuildings,
    buildings,
    resources,
    researchedProjects
  }) => {
    const player = CityPlayer.mockPlayer({
      buildings,
      resources,
      researchedProjects
    });
    return (
      availableBuildings &&
      Object.values(availableBuildings).map(building => {
        const action = new BuildingConstructionAction({ building });
        return {
          building,
          action,
          cost: action.cost(player),
          isAffordable: action.isAffordable(player)
        };
      })
    );
  };

  computeBuildingEffects = ({
    offset,
    buildings,
    availableAreas,
    resources,
    researchedProjects
  }) => {
    const allBuildings = Object.values(buildings);
    const edges = Geom.computeEdges([...allBuildings, ...availableAreas], {
      width: GRID_WIDTH,
      height: GRID_HEIGHT
    });
    Object.assign(offset, edges);

    const player = CityPlayer.mockPlayer({
      buildings,
      resources,
      researchedProjects
    });
    allBuildings.forEach(
      b =>
        (b.availablePeriodicEffects = b.periodicEffects.filter(e =>
          e.isAvailable(player)
        ))
    );
    return buildings;
  };

  onUpdate = events => {
    if (events && events.length) {
      this.setState(prev => {
        for (let event of events) {
          switch (event.type) {
            case kBuildingCompletedEvent:
              prev.notifications.push(MutableObject.mutableCopy(event));
            // falls through
            case kBuildingPlannedEvent:
            case kBuildingProgressEvent:
              prev.buildings[event.object.id] = event.object;
              prev.availableBuildingActions = this.computeBuildingActions(prev);
              this.computeBuildingEffects(prev);
              break;
            case kEarnResourceEvent:
            case kSpendResourceEvent:
              prev.resources = event.player.resources;
              prev.availableBuildingActions = this.computeBuildingActions(prev);
              this.computeBuildingEffects(prev);
              break;
            case kPeriodicEffectProgressEvent:
              if (event.data && event.data.building) {
                prev.buildings[event.data.building.id] = event.data.building;
                this.computeBuildingEffects(prev);
              }
              break;
            case kAvailableAreasChangedEvent:
              prev.availableAreas = event.data.availableAreas;
              break;
            case kAvailableBuildingsChangedEvent:
              prev.availableBuildings = event.data.availableBuildings;
              prev.availableBuildingActions = this.computeBuildingActions(prev);
              this.computeBuildingEffects(prev);
              break;
            default:
              break;
          }
        }
        return prev;
      });
    }
  };

  renderNotification = event => {
    const { id } = event;
    var _top, _left;
    var text;
    if (event.type === kBuildingCompletedEvent) {
      const { object: building } = event;
      const { top, left } = getSpotLocation({
        spot: building,
        offset: this.state.offset
      });
      _top = top;
      _left = left;
      text = 'Complete';
    }

    return (
      <InPlaceNotification
        onComplete={() => this.removeNotification(event)}
        key={id}
        text={text}
        top={_top}
        left={_left}
      />
    );
  };

  render() {
    return (
      <div style={styles.container}>
        <TileLocator
          offset={this.state.offset}
          spot={{
            x: this.state.offset.maxX + 1,
            y: this.state.offset.maxY + 1
          }}
        />
        {this.state.availableAreas.map((spot, idx) => (
          <AvailableSpot
            key={idx}
            spot={spot}
            offset={this.state.offset}
            availableBuildingActions={this.state.availableBuildingActions}
            onPlanBuilding={this.props.onPlanBuilding}
          />
        ))}
        {Object.values(this.state.buildings)
          .sort(Geom.compare)
          .map(b => (
            <BuildingTile
              onCollectFromBuilding={this.props.onCollectFromBuilding}
              key={b.id}
              building={b}
              offset={this.state.offset}
            />
          ))}
        <ReactCSSTransitionGroup
          transitionName="notification"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {this.state.notifications.map(this.renderNotification)}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    position: 'absolute',
    top: 0,
    left: 0
  }
};
export default CityView;
