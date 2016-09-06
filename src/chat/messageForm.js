import React, { Component } from 'react';

export default class MessageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }

    this._changeHandler = this._changeHandler.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  // Dynamically update value attribute
  _changeHandler(e) {
    this.setState({ text : e.target.value });
  }

  _handleSubmit(e) {
    e.preventDefault();
    let message = {
      text: this.state.text
    }

    if (message.text === '') return false;

    this.props.submitMessage(message);
    this.setState({ text: '' });
  }

  render() {
    return(
      <div className="chat-field">
        <form onSubmit={this._handleSubmit} >
          <input onChange={this._changeHandler} value={this.state.text} placeholder="Message Group" />
        </form>
      </div>
    );
  }
}