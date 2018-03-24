import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import GameController from './lib/controller/GameController';
import MainWindow from './components/MainWindowComponent';

import setupDemoData from './lib/demo_data';

setupDemoData()

ReactDOM.render(
  <MainWindow controller={GameController.instance}></MainWindow>, document.getElementById('root'));
registerServiceWorker();
