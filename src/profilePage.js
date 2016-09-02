import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Profile extends Component {
  render() {
    return (
        <div id='profile-container'>
            <p>Profile Page</p>
            <li><Link to='/Main'>MAIN PAGE</Link></li>
        </div>
    )
  }
}
