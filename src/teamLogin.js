import React, {Component} from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';
// import ajax from 'superagent';
import io from 'socket.io-client';
import { hashHistory } from 'react-router';

import Main from './Main';


// Socket handling for app. Must be global to current page for ipcRenderer + React
let socket = io('http://localhost:3000');
let socketRoom = null;

/* listens for a git commit event from main.js webContent.send
 then sends commit string to the server via socket */
ipcRenderer.on('parsedCommit', function(event, arg){
	if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
});

socket.on('incomingCommit', function(data){
	console.log('broadcast loud and clear: ' + data);
});




export default class TeamLogin extends Component {

  _dirChoice() {
    ipcRenderer.send('dirChoice');

  }

_handleSubmit(e) {
  e.preventDefault();
  let orgName = document.getElementById('login-org').value;
  let repoName = document.getElementById('login-repo').value;

  if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
  socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
  socketRoom = `${orgName}.${repoName}live`;

  hashHistory.push('Main');


}
  render() {
    return (

        <div className='login-container' id='teamLogin-container'>
        <h3>PROJECT INFORMATION</h3>

            <h5>Select the local file where your project is located:</h5>
            <button className="login-button" onClick = {this._dirChoice}>FIND FOLDER</button>

            <form onSubmit={this._handleSubmit} className="login-form">
              <h5 className='team-h5'>Enter your team's Github repository:</h5>
              <input id="login-org" placeholder="GITHUB ORGANIZATION" type="text" />
              <input id="login-repo" placeholder="REPO NAME" type="text" />
              <button className="login-button" type="submit">SUBMIT</button>
            </form>

          {/* <li><Link to='/Main'>Continue</Link></li> */}
        </div>
    )
  }
}
