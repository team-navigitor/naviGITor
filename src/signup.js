import React, {Component} from "react";
import { Router, Route, Link } from "react-router";
import { hashHistory } from "react-router";
import $ from 'jquery';
export default class Signup extends Component {

regClicked(e) {
e.preventDefault();
  if ($('#password1').val() !== $('#password2').val()) {
    alert("Passwords do not match, please reenter")
  }
  else {
    let newUser = {
    name: document.getElementById('userNameInput').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password1').value
  }
  $.ajax({
    url: 'http://localhost:3000/signup',
    method: 'POST',
    data: newUser
  })
  hashHistory.push('TeamLogin')  
  }
}


	render() {
    return (
      <div className="login-container">
        <img className="login-logo" src="./images/darknaviGitorLogo_1.png" />
        <h2>LOG IN</h2>
        <form className="reg-form" onSubmit={this.regClicked}>
          <input id="userNameInput" type="text" className="form-control"
          	placeholder="Please enter name" required />
					<input id="email" type="email" className="form-control"
						placeholder="Please enter email"/>
          <input id="password1" type="password" className="form-control"
            placeholder="Please enter Password" required />
					<input id="password2" type="password" className="form-control"
						placeholder="please reenter password" />
          <button id="signUpButton" className="btn btn-primary">Sign Up</button>
        </form>
    </div>
    )
  }
}
