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
  // ajax.get(`https://api.github.com/repos/${orgName}/${repoName}/commits`)
  //   .end((error, response) => {
  //     if (!error && response) {
  //       let apiData = response.body.map(function(item){
  //         return {
  //           name: item.commit.author.name,
  //           date: item.commit.author.date,
  //           message: item.commit.message
  //         }
  //       }).reverse();
  //       console.log(apiData);
  //     } else {
  //       console.log('error fetching Github data', error);
  //     }
  if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
  socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
  socketRoom = `${orgName}.${repoName}live`;
    // }
  // );
  hashHistory.push('Main');

  // TODO: Save for now to transfer to main process later
  // let githubLogin = {
  // 	orgName: orgName,
  // 	repoName: repoName
  // }
  // ipcRenderer.send('githubLogin', githubLogin);
}
  render() {
    return (
        <div id='teamLogin-container'>
          <h1>Enter Your Repository and Project Folder</h1>

            <h5>Select Your Local Project Folder</h5>
            <button className="folder-button" onClick = {this._dirChoice}> Select Project Folder </button>

            <form onSubmit={this._handleSubmit} className="login">
              <h5>Find Your Team's Repository</h5>
              <input id="login-org" placeholder="Github Org" type="text" />
              <input id="login-repo" placeholder="Repo Name" type="text" />
              <button className="login-submit" type="submit">Submit</button>
            </form>


          {/* <li><Link to='/Main'>Continue</Link></li> */}
        </div>
    )
  }
}
