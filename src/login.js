import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import $ from 'jquery'
import { hashHistory } from 'react-router';
import Signup from './signup';
import TeamLogin from './teamLogin';



export default class Login extends Component {
  constructor(props) {
    super(props);
    this.loginClicked = this.loginClicked.bind(this);
  }
  render() {
    return (
      <div className='login-container'>

        <img className='login-logo' src='./images/darknaviGitorLogo_1.png' />
        <form className='login-form'>
            <input id='userNameInput' placeholder='USERNAME' type='text' required />
            <input id='userPasswordInput' type='password' placeholder='PASSWORD' type='text' required />
            <button className='login-button' type="submit" onClick={this.loginClicked}>LOG IN</button>

        </form>

        <div id='signup-button'>
          <p>Don't have an account?  <Link to='Signup' className='signup-link'>Sign Up</Link></p>
        </div>
    </div>
    )
  }

  

  verifyUser(){
    let user = {
      name: $('#userNameInput').val(),
      password: $('#userPasswordInput').val()
    }

    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/verify',
      data: user,
      success: function(x) {
        if (x) hashHistory.push('TeamLogin')
        else hashHistory.push('Signup')
      }
    })
  }

  loginClicked(e){
    e.preventDefault();
    this.verifyUser();
    // if(isAuthenticated){
    //   console.log('isAuthenticated');
    //   hashHistory.push('TeamLogin');
    // }
    // else hashHistory.push('Signup');
     //hashHistory.push('/TeamLogin');
  }

}
