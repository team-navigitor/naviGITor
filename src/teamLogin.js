import React, {Component} from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';
// import ajax from 'superagent';
import io from 'socket.io-client';
import { hashHistory } from 'react-router';

import Main from './Main';


// Socket handling for app. Must be global to current page for ipcRenderer + React
// let socket = io('http://localhost:3000');
// let socketRoom = null;

/* listens for a git commit event from main.js webContent.send
 then sends commit string to the server via socket */
// ipcRenderer.on('parsedCommit', function(event, arg){
// 	if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
// });
//
// socket.on('incomingCommit', function(data){
// 	console.log('broadcast loud and clear: ' + data);
// });




export default class TeamLogin extends Component {
  constructor(props) {
		super(props);


	this.handleData = this.handleData.bind(this);
	}
  _dirChoice() {
    ipcRenderer.send('dirChoice');

  }

  handleData() {
    // console.log("props "+this.props);
    // console.log("propsonHandleData "+this.props.onHandleData());
    // console.log("handle data was triggered");

    var data = {};
    data['orgName'] = document.getElementById('login-org').value;
    data['repoName'] = document.getElementById('login-repo').value;
    console.log("data from child "+JSON.stringify(data));
    this.props.setAppState(data);
    hashHistory.push('/Main');
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
  // if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
  // socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
  // socketRoom = `${orgName}.${repoName}live`;
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

        <div className='login-container' id='teamLogin-container'>
        <h3>PROJECT INFORMATION</h3>
            <h5 >Select the local file where your project is located:</h5>
            <button className="login-button" onClick = {this._dirChoice}>FIND FOLDER</button>

            <form onSubmit={this.handleData} className="login-form">
              <h5 className='team-h5'>Enter your team's Github repository:</h5>
              <input id="login-org" placeholder="GITHUB ORGANIZATION" type="text" />
              <input id="login-repo" placeholder="REPO NAME" type="text" />
              <button className="login-button" type="submit">SUBMIT</button>
            </form>
        </div>
    )
  }
}
