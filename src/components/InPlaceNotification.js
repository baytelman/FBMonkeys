import React, { Component } from 'react';

const NOTIFICATION_DURATION = 0;
export default class InPlaceNotification extends Component {
  state = {
    top: this.props.top - 30,
    left: this.props.left - 20 * (0.5 - Math.random())
  };

  componentDidMount = () => {
    this.timer = setTimeout(this.props.onComplete, NOTIFICATION_DURATION);
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
  };

  render() {
    let { top, left } = this.state;

    return (
      <div
        style={{
          ...this.props.style,
          position: 'absolute',
          top: top,
          left: left
        }}>
        <div
          style={{
            position: 'absolute'
          }}>
          {this.props.text}
        </div>
      </div>
    );
  }
}