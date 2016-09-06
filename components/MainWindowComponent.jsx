var React = require('react');

var CityComponent = require('./CityComponent.jsx').default;

var MainWindow = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        var player = this.props.player;
        return(
            <div id="main-window">
                <CityComponent player={player} />
            </div>
        );
    }
})

export default MainWindow;
