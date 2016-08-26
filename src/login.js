import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import { hashHistory } from 'react-router';

import Main from './Main';
import App from './app';

let isAuthenticated = true;

function verifyUser(){
  console.log(document.getElementById('userNameInput').value);
}
// function signUpClicked(){
//   hashHistory.push('/signup');
// }
function loginClicked(e){
  e.preventDefault();
  verifyUser()
  if(isAuthenticated){
    console.log('isAuthenticated');
    hashHistory.push('Main');
  }
  else {hashHistory.push('/signup');}
}

export default class Login extends Component {
  render() {
    return (
      <div className='login-container'>
      <h2>NAVIGITOR LOG IN PAGE</h2>
      <form className="enter-form" onSubmit={loginClicked}>
      <input id='userNameInput' className="form-control"
            placeholder="Please enter name"
            required />
      <input type='password' className="form-control"
            placeholder="Please enter Password"
            required />
          <button id='LoginButton' type="submit" className="btn btn-primary" onClick={this.loginClicked}>Enter</button>
      <button id='signUpButton' className="btn btn-primary">Sign Up</button>
    </form>
    </div>
    )
  }
}
