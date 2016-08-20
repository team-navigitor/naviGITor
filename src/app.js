//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import ajax from 'superagent';
import Term from './terminal.js'
import Visualization from './visualization';
const {ipcRenderer} = require('electron');

// listens for an git change event from main.js webContent.send
// then sends commit string to the server via socket
ipcRenderer.on('commitMade', function(event, arg){
	let socket = io('http://6aab338c.ngrok.io');
	socket.emit('broadcastCommit', JSON.stringify(arg, null, 4))
})


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: []
		}

		// this.connect = this.connect.bind(this);
		this.handleData = this.handleData.bind(this);
	}

	componentWillMount() {
    this.socket = io('http://6aab338c.ngrok.io');

		console.log("component will mount fired")
		ajax.get('https://api.github.com/repos/team-navigitor/naviGITor/commits')
			.end((error, response) => {
				if (!error && response) {
					let apiData = response.body.map(function(item){
						return { name: item.commit.author.name, date: item.commit.author.date, message: item.commit.message }
					});
					this.setState({ message: apiData });
					console.log(apiData);
				} else {
					console.log('error fetching Github data', error);
				}
			}
		);
	}

	componentDidMount() {
		this.socket.on('test', this.handleData);
		this.socket.on('incomingCommit', this.handleData);
  }
  
	handleData(dataObj) {
		let data = JSON.parse(dataObj);
		console.log("handledata", data);
		this.setState({ message: this.state.message.concat(data) });
	}

	render() {
    return (
			<div className="containing-div-all">
				<h1>GIT TOGETHER</h1>
      		<div className="containing-div">
						<Visualization message={ this.state.message } />
						<Term />
      		</div>
			</div>
    );
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
