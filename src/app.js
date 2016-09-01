//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import io from 'socket.io-client';
import { ipcRenderer } from 'electron';

const { Router, Route, Link, hashHistory, IndexRoute } = require('react-router');
import Main from './Main';
import Login from './login';
import GitTree from './gitTree';
import LocalGitTree from './localGitTree';
import TerminalView from './terminal/terminal.js'

// Socket handling for app. Must be global to current page for ipcRenderer + React
// let socket = io('http://localhost:3000');
// let socketRoom = null;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: []
		}

		this._handleData = this._handleData.bind(this);
	}

	// componentDidMount() {
	// 	socket.on('test', this._handleData);
	// 	socket.on('incomingCommit', this._handleData);
 //  }

	_handleData(dataObj) {
		let data = JSON.parse(dataObj);
		console.log("handledata", data);
	}

	render() {
    return (
			<div>
				{this.props.children}
			</div>
    )
	}
}
export default App;


ReactDOM.render((
   <Router history = {hashHistory}>
      <Route path = "/" component = {App}>
         <IndexRoute component = {Login} />
				 <Route path = "Main" component = {Main}>
				 	 <Route path = "GitTree" component = {GitTree} />
				 	 <Route path = "LocalGitTree" component = {LocalGitTree} />
			     <Route path = "Terminal" component = {TerminalView} />
				</Route>
      </Route>
  </Router>
), document.getElementById('app'))
