
/************************************/
/******** 1. Require Modules ********/
/************************************/

// React
var React = require('react');
var ReactDOM = require('react-dom');

// Components
var MainWindow = require('./components/MainWindowComponent.jsx').default;

// Default Data (user)
var Data                = require('./lib/demo_data.js');
// LocalStorage Data
var localStorageHandler = require('./public/js/localStorageHandler.js');

/************************************/
/*********** 2. Configure ***********/
/************************************/

// Handle localStorage user data
// window.sessionDataObject = localStorageHandler.get('exampleStoredObject');
// if (sessionDataObject)
//     // Apply retrieved localStorage user data
//     Data.user = sessionDataObject;
// else {
//     // Set localStorage user data to defaults
//     localStorageHandler.set('exampleStoredObject', Data.user)
//     window.sessionDataObject = Data.user;
// }

// Set props from retrieved data
var player = Data;
// var something = ExampleStore.getData();

/************************************/
/********** 3. Render View **********/
/************************************/

// Render with props
ReactDOM.render(
    <MainWindow player={player}></MainWindow>,
    document.getElementById('react-container')
);

/************************************/
/********** 4. Post-render **********/
/************************************/

// Require Mixpanel
var Mixpanel = require('./lib/helpers/mixpanel.js');
mixpanel.track('City Instance Loaded');

