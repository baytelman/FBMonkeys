const React = require('react');

var ResourceIcon = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    let id        = 'resource-' + this.props.id,
        className = 'resource-icon ' + this.props.name.toLowerCase(),
        title     = this.props.name + ': ' + this.props.amount;
    return(
      <resource id={id} className='resource' title={title}>
        <amount className='resource-amount'>{this.props.amount}</amount>
        <div className={className}></div>
      </resource>
    )
  }
});

export default ResourceIcon;
