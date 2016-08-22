
var DemoComponent = React.createClass({
  getInitialState: function() {
      return {player:  this.props.data.player};
  },
  render: function() {
    return (
      <demo>This is a DEMO</demo>
    );
  }
});

var renderDemo = function() {
  let component = <DemoComponent data={new Player()}/>;
  ReactDOM.render(component, document.getElementById('demo'));
};
