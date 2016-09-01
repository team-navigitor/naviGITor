import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Main extends Component {
  constructor(props) {
    super(props);
    // this._loginClicked = this._loginClicked.bind(this);
  }

  render() {
    console.log('main page');
    // console.log('in Main '+JSON.stringify(this.props.getAppState));
    return (

      <div id='main-container'>

        <div className='side-nav-bar-container'>

        <div className='image-container'>

        </div>

<div className='nav-links-container'>
            <ul>
              <li><Link to='/Main/GitTree'>GIT TREE</Link></li>
              <li><Link to='/Main/Analytics'>ANALYTICS</Link></li>
							<li><Link to='/Main/Terminal'>TERMINAL</Link></li>
							<li><Link to='/Main/Terminal'>CHAT</Link></li>
              <li><Link to='/'>LOG OUT</Link></li>
            </ul>

</div>
      </div>

	      <div className='view-container'>
  			{this.props.children && React.cloneElement(this.props.children, { setAppState: this.props.setAppState, getAppState: this.props.getAppState } )}
	      </div>

      </div>
    )
  }
}
