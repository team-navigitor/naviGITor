import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import { hashHistory } from 'react-router';

import Main from './Main';

let isAuthenticated = true;

function verifyUser(){
  console.log(document.getElementById('userNameInput').value);
}

function signUpClicked(){
  hashHistory.push('/signup');
}
function loginClicked(e){
  e.preventDefault();
  verifyUser()
  if(isAuthenticated){
    console.log('isAuthenticated');
    hashHistory.push('Main');
  }
  else {hashHistory.push('/signup');}
}


// export class Main extends Component {
//   render() {
//     return (
//       <div id='Main-Page'>
//         <h1>NAVIGITOR</h1>
//         <side-nav-bar />
//         <button>Logout</button>
//         </div>
//     )
//   }
// }


export default class Login extends Component {
  render() {
    return (
      <div className='login-container'>
      <form className="enter-form" onSubmit={loginClicked}>
      <input id='userNameInput' className="form-control"
            placeholder="Please enter name"
            required />
      <input type='password' className="form-control"
            placeholder="Please enter Password"
            required />

            <Link to="/Main">To Main</Link>
          <button id='LoginButton' type="submit" className="btn btn-primary" onClick={this.loginClicked}>Enter</button>
      <button  id='signUpButton' className="btn btn-primary">Sign Up</button>
    </form>
    </div>
    )
  }
}
