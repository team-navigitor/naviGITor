import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import Main from './Main';
import App from './app';

function verifyUser(){
  let user = {
    name: document.getElementById('userNameInput').value,
    password: document.getElementById('loginPwd').value
  }
  console.log(user)
  $.ajax({
    url: "http://localhost:3000/verify",
    type: 'POST',
    data: user
  }).then(data => {
    console.log(data)
  })
}
// function signUpClicked(){
//   hashHistory.push('/signup');
// }
function loginClicked(e){
  e.preventDefault();
  verifyUser()
  // if(isAuthenticated){
  //   console.log('isAuthenticated');
  //   hashHistory.push('Main');
  // }
  // else {hashHistory.push('/signup');}
}

export default class Login extends Component {
  render() {
    return (
      <div className='login-container'>
        <img className="login-logo" src="../images/darknaviGitorLogo_1.png" />
        <h2>LOG IN</h2>
        <form className="enter-form" onSubmit={loginClicked}>
            <input id='userNameInput' className="form-control"
                  placeholder="Please enter name" required />
            <input id="loginPwd" type='password' className="form-control"
                  placeholder="Please enter Password" required />
            <button id='LoginButton' type="submit" className="btn btn-primary" onClick={this.loginClicked}>Enter</button>
            <button id='signUpButton' className="btn btn-primary">Sign Up</button>
        </form>
    </div>
    )
  }
}
