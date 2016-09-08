var React = require('react');

window.CharacterActions = require('../../actions/CharacterActions.js');

var Character = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        var locationStyle = {
            top: this.props.location.y,
            left: this.props.location.x
        }
        return(
            <div className='character-model' style={locationStyle}>{this.props.character.name}</div>
        );
    }
})

export default Character;
