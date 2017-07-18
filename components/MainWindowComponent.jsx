const React = require('react');

const GameComponent = require('./GameComponent.jsx').default;

var MainWindow = React.createClass({
    render: function () {
        var controller = this.props.controller;
        var player = controller.player;
        return(
            <div id="main-window">
                <GameComponent controller={controller} player={player} />
            </div>
        );
    }
})

export default MainWindow;
