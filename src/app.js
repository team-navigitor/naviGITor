//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { ipcRenderer } from 'electron';

const { Router, Route, Link, hashHistory, IndexRoute } = require('react-router');
import Main from './Main';
import Login from './login';
import GitTree from './gitTree';
import TerminalView from './terminal/terminal.js'
import Signup from './signup';
import TeamLogin from './teamLogin';
import Analytics from './analytics';
import Logo from './logopage';

// Socket handling for app. Must be global to current page for ipcRenderer + React
// let socket = io('http://localhost:3000');
// let socketRoom = null;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orgName: '',
			repoName: '',
		}
	// this._handleData = this._handleData.bind(this);
	// this.onHandleData = this.onHandleData.bind(this);
	this.setAppState = this.setAppState.bind(this);
	// this.setState = this.setState.bind(this);
	}
	// handleRepoInfo: function(childName, childValue) {
	// 	let newState = {};
	// 	newState[childName] = childValue;
	// 	this.setState(newState)
	// }

	// componentDidMount() {
	// 	socket.on('test', this._handleData);
	// 	socket.on('incomingCommit', this._handleData);
  // }

	// _handleData(dataObj) {
	// 	let data = JSON.parse(dataObj);
	// 	console.log("handledata", data);
	// }

	setAppState(obj){
		console.log('this state '+JSON.stringify(this.state))
		this.setState.bind(this)(obj);
		console.log('data coming in ' +JSON.stringify(obj));
	}

	// onHandleData(val) {
	// 	// console.log('data coming in' +JSON.stringify(val));
	// 	// console.log('state BEFORE adding data: '+JSON.stringify(this.state.data));
	// 	this.setState.bind(this)({
	// 		data: val
	// 	})
		// console.log('state after adding data: '+JSON.stringify(this.state.data));
	// }

	render() {
    return (
			<div>
			{this.props.children && React.cloneElement(this.props.children, { setAppState: this.setAppState, getAppState: this.state } )}
			</div>
    )
	}
}
export default App;


ReactDOM.render((
   <Router history = {hashHistory}>

      <Route path = "/" component = {App}>

         <IndexRoute component = {TeamLogin} />
				 <Route path = "Signup" component = {Signup} />
				 <Route path = "TeamLogin" component = {TeamLogin} />

					 <Route path = "Main" component = {Main}>
					   <IndexRoute component = {Logo} />
					 	 <Route path = "GitTree" component = {GitTree} />
				     <Route path = "Terminal" component = {TerminalView} />
				     <Route path = "Analytics" component = {Analytics} />
				</Route>
      </Route>
  </Router>
), document.getElementById('app'))
