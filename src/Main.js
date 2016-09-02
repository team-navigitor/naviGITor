import React, {Component} from 'react';
import { Link } from 'react-router';


export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('main page');
    // console.log('in Main '+JSON.stringify(this.props.getAppState));
    return (

      <div id='main-container'>

        <div className='side-nav-bar-container'>
            <div className='nav-image'>
              <img id='profile-pic' src={this.props.getAppState.profilePic}></img>
              <p>{this.props.getAppState.username}</p>
              <p>{this.props.getAppState.repoName}</p>
            </div>
            <div className='nav-links-container'>

              <ul className='fa-ul'>
                <li><i className="fa-li fa fa-user" aria-hidden="true"></i><Link className='list' to='/Main/Profile'>My Profile</Link></li>
                <li><i className="fa-li fa fa-code-fork" aria-hidden="true"></i><Link className='list' to='/Main/GitTree'>Git Tree</Link></li>
                <li><i className="fa-li fa fa-bar-chart" aria-hidden="true"></i><Link className='list' to='/Main/Analytics'>Analytics</Link></li>
  							<li><i className="fa-li fa fa-terminal" aria-hidden="true"></i><Link className='list' to='/Main/Terminal'>Terminal</Link></li>
  							<li><i className="fa-li fa fa-comment-o" aria-hidden="true"></i><Link className='list' to='/Main/Chat'>Chat</Link></li>
                <li><i className="fa-li fa fa-sign-out" aria-hidden="true"></i><Link className='list' to='/'>Log Out</Link></li>
              </ul>
            </div>
            {/* <img className="nav-logo" src="../images/darknaviGitorLogo_1.png" /> */}
          </div>

	      <div className='view-container'>{this.props.children && React.cloneElement(this.props.children, { setAppState: this.props.setAppState, getAppState: this.props.getAppState } )}</div>
      </div>
    )
  }
}
