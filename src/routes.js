import React, { Component } from 'react';
const { Router, Route, Link, hashHistory, IndexRoute } = require('react-router');

import App from './app';
import Main from './main';
import Login from './login';
import Signup from './signup.js'

import GitTree from './gitTree';
import LocalGitTree from './localGitTree';
import TerminalView from './terminal/terminal.js'
import TeamLogin from './teamLogin';
import Analytics from './analytics';
import LocalGraph from './localGraph';
import Logo from './logopage';
import Profile from './profilePage';
// import Chat from './chat';


export default class Routes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history = {hashHistory}>
         <Route path = "/" component = {App}>
           <IndexRoute component = {Login} />
           <Route path = "Signup" component = {Signup} />
           <Route path = "TeamLogin" component = {TeamLogin} />

           <Route path = "Main" component = {Main}>
             <IndexRoute component = {Logo} />
             <Route path = "GitTree" component = {GitTree} />
             <Route path = "LocalGitTree" component = {LocalGitTree} />
             <Route path = "Terminal" component = {TerminalView} />
             <Route path = "Analytics" component = {Analytics} />
             <Route path = "LocalGraph" component = {LocalGraph} />
             <Route path = "Profile" component = {Profile} />
             {/* <Route path = "Chat" component = {Chat} /> */}
           </Route>
         </Route>
      </Router>
    );
  }
}
