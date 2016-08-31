import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Main extends Component {

  render() {
    return (

      <div id='main-container'>

        <div className='side-nav-bar-container'>

            <ul>
              <h5>Navigate</h5>
              <li><Link to='/Main/GitTree'>GIT TREE</Link></li>
              <li><Link to='/Main/Analytics'>ANALYTICS</Link></li>
							<li><Link to='/Main/Terminal'>TERMINAL</Link></li>
              <li><Link to='/'>LOG OUT</Link></li>
            </ul>

      </div>

	      <div className='view-container'>
				{ this.props.children }
					{/* React.cloneElement(this.props.children, { appState.thisState }); */}
	      </div>

      </div>
    )
  }
}
