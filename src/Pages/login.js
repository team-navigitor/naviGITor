import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import $ from 'jquery'
import { hashHistory } from 'react-router';
import Signup from './signup';
import TeamLogin from './teamLogin';



export default class Login extends Component {
  constructor(props) {
    super(props);
    this.submitPassword = this.submitPassword.bind(this);
  }

  verifyUser(){
    let user = {
      name: $('#userNameInput').val(),
      password: $('#userPasswordInput').val()
    }

    $.ajax({
      method: 'POST',
      url: 'http://navigitorsite.herokuapp.com/verify',
      data: user,
      success: function(data) {
        if (data.github) {
          console.log('github: ' + data.github);
          this.props.setAppState({username: user.name});
          this.props.setAppState({githubAvatar: 'https://avatars.githubusercontent.com/'+data.github});
          hashHistory.push('/TeamLogin');
        }
        else if (data) {
          console.log('no github ');
          hashHistory.push('/TeamLogin');
        }
        else hashHistory.push('/Signup');
      }.bind(this)
    });
  }

  submitPassword(e){
    e.preventDefault();
    this.verifyUser();
  }

  render() {
    return (
      <div className='login-container'>
        <img className='login-logo' src='./images/darknaviGitorLogo_1.png' />
        <form className='login-form'>
            <input id='userNameInput' placeholder='USERNAME' type='text' required />
            <input id='userPasswordInput' type='password' placeholder='PASSWORD' required />
            <button className='login-button' type="submit" onClick={this.submitPassword}>LOG IN</button>
        </form>
        <div id='signup-button'>
          <p>Don't have an account? <Link to='Signup' className='signup-link'>Sign Up</Link></p>
        </div>
    </div>
    )
  }
}
