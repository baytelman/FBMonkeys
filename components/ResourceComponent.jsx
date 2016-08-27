var React = require('react');

var Resource= React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  render: function() {
    return(
      <resource>
        <type>{this.props.data.type}</type>
        <amount>{this.props.data.amount}</amount>
      </resource>
    )
  }
});

export default Resource;
