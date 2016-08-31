import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import { hashHistory } from 'react-router';

import Main from './Main';
import App from './app';
import Signup from './signup';
import TeamLogin from './teamLogin';

let isAuthenticated = true;

function verifyUser(){
  console.log(document.getElementById('userNameInput').value);
}
function signUpClicked(){
  hashHistory.push('Signup');
}
function loginClicked(e){
  e.preventDefault();
  verifyUser()
  if(isAuthenticated){
    console.log('isAuthenticated');
    hashHistory.push('TeamLogin');
  }
  else hashHistory.push('Signup');
}

export default class Login extends Component {
  render() {
    return (
      <div className='login-container'>
        <img className="login-logo" src="../images/darknaviGitorLogo_1.png" />
        <h2>LOG IN</h2>
        <form className="enter-form">
            <input id='userNameInput' className="form-control"
                  placeholder="Please enter name" required />
            <input type='password' className="form-control"
                  placeholder="Please enter Password" required />

            <button id='LoginButton' type="submit" className="btn btn-primary" onClick={loginClicked}>Enter</button>

            <button id='signUpButton' className="btn btn-primary" onClick={signUpClicked}>Sign Up</button>

        </form>
    </div>
    )
  }
}
