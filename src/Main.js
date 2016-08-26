import React, {Component} from 'react';
import { Link } from 'react-router';


export default class Main extends Component {
  render() {
    return (
      <div id='main-container'>

        <div className='side-nav-bar-container'>
            <h2>NAVIGITOR</h2>
            <form className="login">
              <h5>Find Repository</h5>
              <input id="login-org" placeholder="Github Org" type="text" />
              <input id="login-repo" placeholder="Repo Name" type="text" />
              <button className="login-submit" type="submit">Submit</button>
            </form>
            {/* <button onClick = {dirChoice}> Select Project Folder </button>
            <form onSubmit={this._handleSubmit.bind(this)} className="login">
              <input id="login-org" placeholder="Github Organization" type="text" />
              <input id="login-repo" placeholder="Repo Name" type="text" />
              <button className="login-submit" type="submit">Submit</button>
            </form>
            <button onClick = {dirChoice}> Select Project Folder </button> */}
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
