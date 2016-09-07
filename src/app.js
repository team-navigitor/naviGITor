//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { ipcRenderer } from 'electron';
import $ from 'jquery';

let socket = io('http://navigitorsite.herokuapp.com');
let socketRoom = null;
import Routes from './routes';


export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orgName: '',
			repoName: '',
			newestGitEvent: '',
			profilePic: 'https://avatars1.githubusercontent.com/u/8155387?v=3&s=400',
			username: '',
			repoData: '',

		}
		this.setAppState = this.setAppState.bind(this);
		// this.setState = this.setState.bind(this);
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

		ipcRenderer.on('parsedCommitAll', function(event, arg){
			let data = {};
			data['username'] = arg;
			console.log('arg' + arg);
			// console.log('setappstate' + this.props.setAppState);
			// this.setState.bind(this)(data);
			this.setAppState.bind(this)(data);
		 });

		 //call to database, fill in state
		 //ajax call to fill in profile pic
	}

	// Socket handling for app. Must be global to current page for ipcRenderer + React
	setSocketRoom(obj) {
		if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
		socket.emit("subscribe", { room: `${obj.orgName}.${obj.repoName}live` });
		socketRoom = `${obj.orgName}.${obj.repoName}live`;
	}

	// need to test this func being called from other components
	setAppState(obj){
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

ReactDOM.render((<Routes />), document.getElementById('app'));
