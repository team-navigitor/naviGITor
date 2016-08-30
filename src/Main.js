import React, {Component} from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';
import ajax from 'superagent';
import io from 'socket.io-client';

// Socket handling for app. Must be global to current page for ipcRenderer + React
let socket = io('http://navigitorsite.herokuapp.com');
let socketRoom = null;

/* listens for an git commit event from main.js webContent.send
 then sends commit string to the server via socket */
ipcRenderer.on('parsedCommit', function(event, arg){
	if(socketRoom) socket.emit('broadcastCommit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 4)});
});

/* listens for an git branch checkout event from main.js webContent.send
 then sends commit string to the server via socket */
ipcRenderer.on('changedBranches', function(event, arg){
	if(socketRoom) socket.emit('broadcastBranch', {'room': socketRoom, 'data': JSON.stringify(arg, null, 4)});
});


export default class Main extends Component {


    _dirChoice() {
  	   ipcRenderer.send('dirChoice');
    }

  	_handleSubmit(e) {
  		e.preventDefault();

  		let orgName = document.getElementById('login-org').value;
  		let repoName = document.getElementById('login-repo').value;

  		ajax.get(`https://api.github.com/repos/${orgName}/${repoName}/commits`)
  			.end((error, response) => {
  				if (!error && response) {
  					let apiData = response.body.map(function(item){
  						return {
  							name: item.commit.author.name,
  							date: item.commit.author.date,
  							message: item.commit.message
  						}
  					}).reverse();
  					// this.setState({ message: apiData });
  					console.log(apiData);
  				} else {
  					console.log('error fetching Github data', error);
  				}
  				if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
  				socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
  				socketRoom = `${orgName}.${repoName}live`;
  			}
  		);
  		// Save for now to transfer to main process later
  		// let githubLogin = {
  		// 	orgName: orgName,
  		// 	repoName: repoName
  		// }
  		// ipcRenderer.send('githubLogin', githubLogin);
  	}

  render() {
    return (

      <div id='main-container'>

        <div className='side-nav-bar-container'>
            <img className="side-nav-logo" src="../images/darknaviGitorLogo_1.png" />
            <form onSubmit={this._handleSubmit} className="login">
              <h5>Find Repository</h5>
              <input id="login-org" placeholder="Github Org" type="text" />
              <input id="login-repo" placeholder="Repo Name" type="text" />
              <button className="login-submit" type="submit">Submit</button>
            </form>
            <button className="folder-button" onClick = {this._dirChoice}> Select Project Folder </button>

            {/* <div className="container_visualizationAndTerminal">
              <GitTree message={ this.state.message } />
              <Term />
            </div> */}
            <ul>
              <h5>Navigate</h5>
              <li><Link to='/Main/GitTree'>GIT TREE</Link></li>
              <li><Link to='/Main/Terminal'>TERMINAL</Link></li>
              <li><Link to='/'>LOG OUT</Link></li>
            </ul>
      </div>

      <div className='view-container'>
         {this.props.children}
      </div>

      </div>
    )
  }
}
