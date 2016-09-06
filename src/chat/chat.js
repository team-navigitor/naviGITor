import React, {Component} from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';
import MessageForm from './messageForm';
import Message from './message';
import MessageList from './messageList';

// Change to Heroku URI for deployment
let socket = io('http://localhost:3000');
// let socket = io('http://navigitorsite.herokuapp.com');

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      username: 'binh',
      messages: []
    }

    this._handleMessageSubmit = this._handleMessageSubmit.bind(this);
  }

  componentWillMount(){
    socket.on('sendMessage', this._messageReceive);
    // socket.on('sendMessage', this._handleMessageSubmit);
  }

  _messageReceive(message) {
    this.state.messages.push(message);
    this.setState(this.state);
  }

  // Each message will be mapped out into list
  _handleMessageSubmit(message) {
    this.state.messages.push(message);
    this.setState(this.state);

    socket.emit('sendMessage', message);
    // console.log(message.text);
  }

  render() {
    return(
      <div className="chat-room">
        <MessageList username={this.state.username} messages={this.state.messages}/>
        <MessageForm submitMessage={this._handleMessageSubmit}/>
      </div>
    );
  }
}
