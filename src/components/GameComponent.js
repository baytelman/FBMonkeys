import React, {Component} from 'react'

import Player from './PlayerComponent';

let freq = 0.05;

class GameComponent extends Component {
  constructor(props) {
    super(props)
    this.tick = this
      .tick
      .bind(this)
  }
  tick() {
    let events = this
      .props
      .controller
      .tick(freq)
    events.forEach((event) => console.log(event))
    this.forceUpdate()
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000 * freq)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return (
      <div id='game'>
        <Player player={this.props.player}/>
      </div>
    );
  }
}

export default GameComponent
