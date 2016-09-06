//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { ipcRenderer } from 'electron';

const { Router, Route, Link, hashHistory, IndexRoute } = require('react-router');
import Main from './main';
import Login from './login';
import Signup from './signup.js'
import GitTree from './gitTree';
import LocalGitTree from './localGitTree';
import TerminalView from './terminal/terminal.js'
import TeamLogin from './teamLogin';
import Analytics from './analytics';
import Logo from './logopage';
import Profile from './profilePage';
import Chat from './chat';


let socket = io('http://localhost:3000');
let socketRoom = null;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orgName: '',
			repoName: 'Navigitor',
			newestGitEvent: '',
			profilePic: 'https://avatars1.githubusercontent.com/u/8155387?v=3&s=400',
			username: 'Binh Nguyen',
		}
		this.setAppState = this.setAppState.bind(this);
	}

	componentDidMount() {
		console.log('app component did mount')
		/* listens for a git commit event from main.js webContent.send then sends commit string to the server via socket */
		ipcRenderer.on('parsedCommit', function(event, arg){
			if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
		});

		//NEED TO TEST
		socket.on('incomingCommit', function(data){
			console.log('broadcast loud and clear: ' + data);
			// this.setState.bind(this)(data);
		});
	}

	// Socket handling for app. Must be global to current page for ipcRenderer + React
	setSocketRoom(obj) {
		if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
		socket.emit("subscribe", { room: `${obj.orgName}.${obj.repoName}live` });
		socketRoom = `${obj.orgName}.${obj.repoName}live`;
	}

	// need to test this func being called from other components
	setAppState(obj){
		console.log('this state '+JSON.stringify(this.state))
		this.setState.bind(this)(obj);
		console.log('data coming in ' +JSON.stringify(obj));
		if (obj['orgName']) {
			console.log('yes obj is orgName '+obj['orgName']);
			this.setSocketRoom(obj);
		}
	}

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
        <IndexRoute component = {Login} />
				<Route path = "Signup" component = {Signup} />
				<Route path = "TeamLogin" component = {TeamLogin} />

				<Route path = "Main" component = {Main}>
				  <IndexRoute component = {Logo} />
				 	<Route path = "GitTree" component = {GitTree} />
				 	<Route path = "LocalGitTree" component = {LocalGitTree} />
			    <Route path = "Terminal" component = {TerminalView} />
			    <Route path = "Analytics" component = {Analytics} />
					<Route path = "Profile" component = {Profile} />
					<Route path = "Chat" component = {Chat} />
				</Route>
      </Route>
  </Router>
), document.getElementById('app'))
