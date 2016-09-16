import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, hashHistory, IndexRoute } from 'react-router';
// const { Router, Route, hashHistory, IndexRoute } = require('react-router');

import App from './app';
import Login from './Pages/login';
import Signup from './Pages/signup';
import TeamLogin from './Pages/teamLogin';
import Main from './Pages/main';
import Logo from './logopage';
import TeamGitTree from './gitTree/teamGitTree';
import LocalGitTree from './gitTree/localGitTree';
import TerminalView from './terminal/terminal.js';
import TeamAnalytics from './analytics.js';
import LocalGraph from './localGraph';
import Profile from './profilePage';

function Routes() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="Signup" component={Signup} />
        <Route path="TeamLogin" component={TeamLogin} />

        <Route path="Main" component={Main}>
          <IndexRoute component={Logo} />
          <Route path="TeamGitTree" component={TeamGitTree} />
          <Route path="LocalGitTree" component={LocalGitTree} />
          <Route path="TeamAnalytics" component={TeamAnalytics} />
          <Route path="Terminal" component={TerminalView} />
          <Route path="LocalGraph" component={LocalGraph} />
          <Route path="Profile" component={Profile} />
        </Route>
      </Route>
    </Router>
  );
}

ReactDOM.render((<Routes />), document.getElementById('app'));
