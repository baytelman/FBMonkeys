import React from 'react';
import Dimensions from 'Dimensions';
import { Svg } from 'expo';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import GameController from './controller/GameController';
import CityBuilding from './controller/CityBuilding';
import {
  kBuildingPlannedEvent,
  kBuildingProgressEvent,
  kBuildingCompletedEvent,
  kAvailableAreasChangedEvent
} from './controller/CityEvent';
import { MutableObject, Hex } from './controller/utils/Utils';

const TICK_MS = 111;

const GRID_WIDTH = 64.0;
const GRID_HEIGHT = 64.0;
const getBuildingLocation = ({ building, offset }) => {
  return {
    left: GRID_WIDTH * (building.x + building.y / 2 - 0.5) - offset.x,
    top: GRID_HEIGHT * ((building.y * 3) / 4 - 0.5) - offset.y
  };
};

const HexagonComponent = ({ stroke = 'black', fill = 'yellow' }) => (
  <Svg
    style={{
      position: 'absolute',
      top: 0,
      left: 0
    }}
    height={GRID_HEIGHT}
    width={GRID_WIDTH}>
    <Svg.Path
      d={`M ${GRID_WIDTH / 2} 0  L
0 ${GRID_HEIGHT / 4} 
0 ${(3 * GRID_HEIGHT) / 4} 
${GRID_WIDTH / 2} ${GRID_HEIGHT} 
${GRID_WIDTH} ${(3 * GRID_HEIGHT) / 4}
${GRID_WIDTH} ${GRID_HEIGHT / 4} Z`}
      stroke={stroke}
      fill={fill}
    />
  </Svg>
);

const AvailableSpot = ({ key, spot, offset = { x: 0, y: 0 } }) => {
  const { top, left } = getBuildingLocation({ building: spot, offset });
  return (
    <View
      key={key + 'AvailableSpot' + top + ',' + left}
      style={{
        position: 'absolute',
        left,
        top,
        width: GRID_WIDTH,
        height: GRID_HEIGHT
      }}>
      <HexagonComponent fill="rgba(0,0,0,0)" stroke="rgba(0,0,0,0.5)" />
    </View>
  );
};

const Building = ({ building, offset = { x: 0, y: 0 } }) => {
  const { top, left } = getBuildingLocation({ building, offset });
  return (
    <View
      tag={building.id}
      style={{
        position: 'absolute',
        left,
        top,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        opacity: 0.2 + Math.pow(building.progress(), 2) * 0.7
      }}>
      <HexagonComponent />
      <Text
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
        {building.name}
        {'\n'}
        {building.getStatus()}
      </Text>
    </View>
  );
};

const NOTIFICATION_DURATION = 1000;
class InPlaceNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1),
      top: new Animated.Value(props.top),
      left: new Animated.Value(props.left)
    };
  }
  state = {};
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 0.2,
      duration: NOTIFICATION_DURATION,
      easing: Easing.out(Easing.quad)
    }).start(this.props.onComplete);

    Animated.timing(this.state.top, {
      toValue: this.props.top - 30,
      duration: NOTIFICATION_DURATION,
      easing: Easing.out(Easing.quad)
    }).start();

    if (this.props.randomLeft) {
      Animated.timing(this.state.left, {
        toValue: this.props.left - 20 * (0.5 - Math.random()),
        duration: NOTIFICATION_DURATION
      }).start();
    }
  }

  render() {
    let { opacity, top, left } = this.state;

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: opacity,
          position: 'absolute',
          top: top,
          left: left
        }}>
        <Text
          style={{
            position: 'absolute'
          }}>
          {this.props.text}
        </Text>
      </Animated.View>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.controller = new GameController({ onUpdate: this.onCityUpdate });
    this.state = {
      offset: {
        x: -Dimensions.get('window').width / 2,
        y: -Dimensions.get('window').height / 2
      },
      availableAreas: [],
      buildings: {},
      notifications: []
    };
  }

  componentDidMount = () => {
    this.controller.addBuilding(
      new CityBuilding({
        name: '0,0',
        x: 0,
        y: 0,
        time: Math.random() * 5 + 2
      })
    );

    this.timer = setInterval(this.tick, TICK_MS);
  };

  tick = async () => {
    this.controller.updateTime(TICK_MS / 1000.0);
  };
  removeNotification = event => {
    this.setState(prev => {
      prev.notifications = prev.notifications.filter(e => e !== event);
      return prev;
    });
  };

  onCityUpdate = events => {
    if (events && events.length) {
      this.setState(prev => {
        for (event of events) {
          switch (event.type) {
            case kBuildingCompletedEvent:
              prev.notifications.push(MutableObject.mutableCopy(event));
            case kBuildingPlannedEvent:
            case kBuildingProgressEvent:
              prev.buildings[event.object.id] = event.object;
              break;
            case kAvailableAreasChangedEvent:
              prev.availableAreas = event.data.availableAreas;
              break;
            default:
              console.log({ type: event.type });
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
      const { top, left } = getBuildingLocation({
        building,
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
      <View style={styles.container}>
        {this.state.availableAreas.map((spot, idx) => (
          <AvailableSpot key={idx} spot={spot} offset={this.state.offset} />
        ))}
        {Object.values(this.state.buildings)
          .sort(Hex.compare)
          .map(b => (
            <Building key={b.id} building={b} offset={this.state.offset} />
          ))}
        {this.state.notifications.map(this.renderNotification)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
