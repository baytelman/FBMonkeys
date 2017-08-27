
/************************************/
/******** 1. Require Modules ********/
/************************************/

// React
const React = require('react');
const ReactDOM = require('react-dom');

// Components
const MainWindow = require('../components/MainWindowComponent.jsx').default;

// Default Data (user)
const Data                = require('../lib/demo_data.js');

/************************************/
/*********** 2. Configure ***********/
/************************************/

// Set props from retrieved data
const GameController      = require('../lib/controller/GameController.js').default;
// var something = ExampleStore.getData();

/************************************/
/********** 3. Render View **********/
/************************************/

// Render with props
ReactDOM.render(
  <MainWindow controller={GameController.instance}></MainWindow>,
  document.getElementById('react-container')
);

/************************************/
/********** 4. Post-render **********/
/************************************/

// Require Mixpanel
const Mixpanel = require('../lib/helpers/mixpanel.js');
mixpanel.track('City Instance Loaded');
