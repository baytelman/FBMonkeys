const React = require('react');

export const ResourceIcon = (namespace) => (<div className={'resource-icon ' + namespace.toLowerCase()}></div>);

var ResourceSummaryComponent = React.createClass({
  getInitialState: function () {
    return {}
  },
  render: function () {
    const id = 'resource-' + this.props.resource.id;
    const amount = Math.floor(this.props.resource.amount);
    const title = this.props.resource.toString();
    const max = this.props.max;

    return (
      <resource id={id} className='resource' title={title}>
        <amount className='resource-amount'>{amount}</amount>
        /
        <amount className='max-amount'>{max}</amount>
        { ResourceIcon(this.props.resource.namespace) }
      </resource>
    );
  }
});

export default ResourceSummaryComponent;
