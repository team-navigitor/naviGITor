import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Signup extends Component {
  render() {
    return (
        <div id='signup-container'>
            <h1>Sign Up Page</h1>
            <li><Link to='/Main'>MAIN PAGE</Link></li>
        </div>
    )
  }
}
