import React, {Component} from 'react'

import Player from './PlayerComponent';

let freq = 0.05;

class GameComponent extends Component {
  constructor(props) {
    super(props)
    this.tick = this.tick.bind(this)
  }
  tick() {
    this
      .props
      .controller
      .tick(freq);
    this.forceUpdate();
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000 * freq);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <game id='game'>
        <Player player={this.props.player}/>
      </game>
    );
  }
}

export default GameComponent;
