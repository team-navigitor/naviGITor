import React, { Component } from 'react';
const { Router, Route, Link, hashHistory, IndexRoute } = require('react-router');
import ReactDOM from 'react-dom';

import App from './app';

import Main from './Pages/main';
import Login from './Pages/login';
import Signup from './Pages/signup';
import TeamLogin from './Pages/teamLogin';

import GitTree from './gitTree';
import LocalGitTree from './localGitTree';
import TerminalView from './terminal/terminal.js'
import LocalGraph from './localGraph';
import Logo from './logopage';
import Profile from './profilePage';


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
             <Route path = "LocalGraph" component = {LocalGraph} />
             <Route path = "Profile" component = {Profile} />
           </Route>
         </Route>
      </Router>
    );
  }
}

ReactDOM.render((<Routes />), document.getElementById('app'));
