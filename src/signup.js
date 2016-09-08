import React, {Component} from "react";
import { Router, Route, Link } from "react-router";
import { hashHistory } from "react-router";
import $ from 'jquery';
import TeamLogin from './teamLogin';


export default class Signup extends Component {
  constructor(props) {
		super(props);
	}

  regClicked(e) {
    e.preventDefault();
    if (document.getElementById('password1').value !== document.getElementById('password2').value) return console.log('Password doesn\'t match')
    let newUser = {
      username: document.getElementById('userNameInput').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password1').value,
      github: document.getElementById('githubUsername').value
    }
    $.ajax({
      url: 'http://navigitorsite.herokuapp.com/signup',
      method: 'POST',
      data: newUser,
      success: console.log('success!')
    })
    hashHistory.push('/TeamLogin');
  }

  	render() {

      return (
        <div className="login-container">
          <img className="login-logo" src="./images/darknaviGitorLogo_1.png" />
          <form className="login-form" onSubmit={this.regClicked}>
            <input id="userNameInput" type="text" placeholder="Please enter username" required />
            <input id="githubUsername" type="text" placeholder="Please enter your github username"/>
            <input id="email" type="email" placeholder="Please enter email"/>
            <input id="password1" type="password" placeholder="Please enter Password" required />
  					<input id="password2" type="password" placeholder="please verify password"/>
            <button id="signUpButton" className="login-button">Sign Up</button>
          </form>
          <div id='signup-button'>
            <Link to='/' className='signup-link'>Back to Login Page</Link>
          </div>
      </div>
      )
    }
}
