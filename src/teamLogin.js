import React, {Component} from 'react';
import { Link } from 'react-router';
import { ipcRenderer } from 'electron';

import { hashHistory } from 'react-router';
import Main from './main';



export default class TeamLogin extends Component {
  constructor(props) {
		super(props);

	  this.handleData = this.handleData.bind(this);
    this.dirChoice = this.dirChoice.bind(this);
	}

  dirChoice() {
    ipcRenderer.send('dirChoice');
  }

  //sends org name and repo name data to app state
  handleData(e) {
    e.preventDefault();
    var data = {};
    data['orgName'] = document.getElementById('login-org').value;
    data['repoName'] = document.getElementById('login-repo').value;
    sessionStorage.setItem('collection', data.orgName + '.' + data.repoName + 'live')
    console.log("data from child "+JSON.stringify(data));
    this.props.setAppState(data);
    hashHistory.push('/Main');
  }

  render() {
    return (
        <div className='login-container' id='teamLogin-container'>
        <h3>PROJECT INFORMATION</h3>
          <h5 >Select the local file where your project is located:</h5>
          <button className="login-button" onClick = {this.dirChoice}>FIND FOLDER</button>

          <form onSubmit={this.handleData} className="login-form">
            <h5 className='team-h5'>Enter your team's Github repository:</h5>
            <input id="login-org" placeholder="GITHUB ORGANIZATION" type="text" />
            <input id="login-repo" placeholder="REPO NAME" type="text" />
            <button className="login-button" type="submit">SUBMIT</button>
          </form>

          <Link to='/Main' className='signup-link'>Main Page</Link>
        </div>
    )
  }
}
