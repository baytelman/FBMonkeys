var React = require('react');

var GameComponent = require('./GameComponent.jsx').default;

var MainWindow = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        var player = this.props.player;
        return(
            <div id="main-window">
                <GameComponent player={player} />
            </div>
        );
    }
})

export default MainWindow;
