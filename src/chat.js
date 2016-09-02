import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Chat extends Component {
  render() {
    return (
        <div id='chat-container'>
            <p>Chat Page</p>
            <li><Link to='/Main'>MAIN PAGE</Link></li>
        </div>
    )
  }
}
