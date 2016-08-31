import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Main extends Component {
  constructor(props) {
    super(props);


    // this._loginClicked = this._loginClicked.bind(this);
  }

  render() {
      console.log('in Main '+JSON.stringify(this.props.getAppState));
    return (

      <div id='main-container'>

        <div className='side-nav-bar-container'>

        <h1>{this.props.getAppState.orgName}</h1>
        {/* <h1>{this.props.repoName}</h1> */}

            <ul>
              <h5>Navigate</h5>
              <li><Link to='/Main/GitTree'>GIT TREE</Link></li>
              <li><Link to='/Main/Analytics'>ANALYTICS</Link></li>
							<li><Link to='/Main/Terminal'>TERMINAL</Link></li>
              <li><Link to='/'>LOG OUT</Link></li>
            </ul>

      </div>

	      <div className='view-container'>
  			{this.props.children && React.cloneElement(this.props.children, { setAppState: this.props.setAppState, getAppState: this.props.getAppState } )}
	      </div>

      </div>
    )
  }
}
