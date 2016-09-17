import io from 'socket.io-client';
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import '../scss/main.scss';

const socket = io('http://navigitorsite.herokuapp.com');
let socketRoom = null;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgName: '',
      repoName: '',
      newestGitEvent: '',
      githubAvatar: '',
      username: '',
      teamData: [],
      localData: [],
    };
    this.setAppState = this.setAppState.bind(this);
  }

  componentDidMount() {
    // receives historical data of entire team's git logs from DB; saves to state
    socket.on('completeDBLog', function (data) {
      this.setAppState({ teamData: data });
    }.bind(this));

    // receives historical data from user's local git log file; saves to state
    ipcRenderer.on('parsedCommitAll', function (event, arg) {
      const data = {};
      data.localData = arg;
      this.setAppState(data);
    }.bind(this));

		// listens for real-time updates (live commits) from user's local git file; saves to state
    ipcRenderer.on('parsedCommit', function (event, arg) {
      if (socketRoom) socket.emit('broadcastGit', { room: socketRoom, data: JSON.stringify(arg, null, 1) });
      this.setAppState({ localData: this.state.localData.concat(arg) });
    }.bind(this));

		// listens for real-time updates (live commits) from a team member's local git files; saves to state
    socket.on('incomingCommit', function (data) {
    // Sent incoming commit to main processor to git tree
      ipcRenderer.send('newCommitToRender', JSON.parse(data));
      this.setAppState({ teamData: this.state.teamData.concat([JSON.parse(data)]) });
    }.bind(this));
  }

  // plugs user into same room with team members
  setSocketRoom(obj) {
    if (socketRoom) socket.emit('unsubscribe', { room: socketRoom });
    socket.emit('subscribe', { room: `${obj.orgName}.${obj.repoName}live` });
    socketRoom = `${obj.orgName}.${obj.repoName}live`;
  }

  // method to be passed down to child components for them to access state
  setAppState(obj) {
    this.setState.bind(this)(obj);
    if (obj.orgName) this.setSocketRoom(obj);
  }

  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, {
          setAppState: this.setAppState,
          getAppState: this.state,
        })}
      </div>
    );
  }
}
