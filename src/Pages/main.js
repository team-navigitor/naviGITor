import React, { Component } from 'react';
import { Link } from 'react-router';


export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('curent state: '+JSON.stringify(this.props.getAppState.globalData))
    return (

      <div id='main-container'>
        <div className='nav-bar-container'>
            <img className='nav-bar-avatar' src={this.props.getAppState.githubAvatar}></img>
            <p>{this.props.getAppState.username}</p>
            <p>{this.props.getAppState.repoName}</p>
            <div className='nav-bar-divider'></div>
            <ul>
              <li><Link to='/Main/Profile'><i className="fa fa-user" aria-hidden="true"></i>My Profile</Link></li>
              <li><Link to='/Main/TeamGitTree'><i className="fa fa-tree" aria-hidden="true"></i>Global Git Tree</Link></li>
              <li><Link to='/Main/LocalGitTree'><i className="fa fa-code-fork" aria-hidden="true"></i>Local Git Tree</Link></li>

              {/* <li><Link to='/Main/Analytics'><i className="fa fa-bar-chart" aria-hidden="true"></i>Analytics</Link></li> */}

              <li><Link to='/Main/LocalGraph'><i className="fa fa-bar-chart" aria-hidden="true"></i>Local Analytics</Link></li>

							<li><Link to='/Main/Terminal'><i className="fa fa-terminal" aria-hidden="true"></i>Terminal</Link></li>
              <li><Link to='/'><i className="fa fa-sign-out" aria-hidden="true"></i>Log Out</Link></li>
            </ul>
          </div>

	      <div className='view-container'>{React.cloneElement(this.props.children, { setAppState: this.props.setAppState, getAppState: this.props.getAppState } )}</div>
      </div>
    );
  }
}
