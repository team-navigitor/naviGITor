import React, { Component } from 'react';
import Message from './message';
 
export default class MessageList extends Component {
	constructor(props) {
		super(props);
	}

  render () {
	  let renderMessage = function(message, i) {
	    return <Message key={i} msg={message.text} username={message.username} />
	  }

    return(
	    <ul className="chat-messages">
	      {this.props.messages.map(renderMessage)}
	    </ul>
    );
  }
}