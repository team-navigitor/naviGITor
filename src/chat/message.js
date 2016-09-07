import React, { Component } from 'react';

export default class Message extends Component {
  render() {
    return(
      <li className="chat-message">
      	{this.props.username}: {this.props.msg}
      </li>
    );
  }
}