//SCSS file
import '../scss/main.scss';

'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
//let socket = io('http://188e4ab5.ngrok.io');
const {ipcRenderer} = require('electron')




class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// status: 'disconnected',
      // title: '',
			message: null
		}

		this.connect = this.connect.bind(this);
		this.handleData = this.handleData.bind(this);
	}

	componentWillMount() {
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', this.connect);

    // this.socket.on('disconnect', this.disconnect.bind(this));
	}

	connect() {
		// alert("connected!");
    this.setState({ status: 'connected' });
	}
	// disconnect() {
  //   this.setState({ status: 'disconnected' });
	// }
	componentDidMount() {
	  // socket.on('news', this.handleData)
		// socket.on('news', function(data){
		// 	console.log(data);
		// });
		this.socket.on('test', this.handleData);



  }

	handleData(data) {
		console.log("handledata", data);
		this.setState({ message: data });
		console.log("this state: " +this.state.message);
	}

	render() {
		// this.socket.on('test', function(data) {
		// 	console.log('test in did mount in socket' + data);
		// });
		console.log("in render: "+this.state.message)
		if (this.state.message === null) {
			console.log("state is null");
			return null
		}
		let obj = JSON.parse(this.state.message);
		let commit = obj.map(function(info, i){
			return (
				<div key={i}>
					<p>{ info.name }:</p>
					<p>{ info.message }</p>
    		</div>
			)
		});

    return (
      <div>
      	<div className="myDiv">
      	  <h1>Git Together</h1>
					<div>
						{ commit }
						</div>
      	  {/* <a href="/auth/github">Login /w Github</a> */}
      	</div>
      </div>
    );
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
