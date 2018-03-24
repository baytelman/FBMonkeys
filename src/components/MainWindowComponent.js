import React from 'react'

import GameComponent from './GameComponent';

import '../App.css';

var MainWindow = (props) => {
        var controller = props.controller;
        var player = controller.player;
        return(
            <div id="main-window">
                <GameComponent controller={controller} player={player} />
            </div>
        );
    }

export default MainWindow;
