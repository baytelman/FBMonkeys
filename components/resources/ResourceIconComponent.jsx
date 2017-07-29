const React = require('react');

var ResourceIcon = React.createClass({
  getInitialState: function () {
    return {}
  },
  render: function () {
    const id = 'resource-' + this.props.resource.id;
    const className = 'resource-icon ' + this.props.resource.type.toLowerCase();
    const amount = Math.floor(this.props.resource.amount);
    const title = this.props.resource.toString();
    const max = this.props.max;

    return (
      <resource id={id} className='resource' title={title}>
        <amount className='resource-amount'>{amount}</amount>
        /
        <amount className='max-amount'>{max}</amount>
        <div className={className}></div>
      </resource>
    );
  }
});

export default ResourceIcon;
