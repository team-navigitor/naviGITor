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
import Terminal from './terminal/terminal.js'

// // Socket handling for app. Must be global to current page for ipcRenderer + React
// let socket = io('http://navigitorsite.herokuapp.com');
// let socketRoom = null;
//
// /* listens for an git commit event from main.js webContent.send
//  then sends commit string to the server via socket */
// ipcRenderer.on('commitMade', function(event, arg){
// 	if(socketRoom) socket.emit('broadcastCommit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 4)});
// });
//
// /* listens for an git branch checkout event from main.js webContent.send
//  then sends commit string to the server via socket */
// ipcRenderer.on('changedBranches', function(event, arg){
// 	if(socketRoom) socket.emit('broadcastBranch', {'room': socketRoom, 'data': JSON.stringify(arg, null, 4)});
// });


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: []
		}
		this._handleData = this._handleData.bind(this);
	}

	componentDidMount() {
		socket.on('test', this._handleData);
		socket.on('incomingCommit', this._handleData);
  }

	_handleData(dataObj) {
		let data = JSON.parse(dataObj);
		console.log("handledata", data);
		this.setState({ message: this.state.message.concat(data) });
	}

	// function dirChoice() {
	// 	ipcRenderer.send('dirChoice');
	// }


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
			     <Route path = "Terminal" component = {Terminal} />
				</Route>
      </Route>
  </Router>
), document.getElementById('app'))
