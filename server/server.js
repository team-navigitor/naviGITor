const express = require('express');
const app = express();
// may need to change config to config.prod later on
const config = require('../webpack.config');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const server = app.listen(3000);
const io = require('socket.io').listen(server);

// hands this compiler off to the middleware for hot reloading
const compiler = webpack(config);
var data = JSON.stringify([{name: 'steve', message: 'commit message by steve'}, {name: 'sarah', message: 'commit message'}]);
var data2 = JSON.stringify([{name: 'colin', message: 'colin commit message'}, {name: 'binh', message: 'binh commit message'}]);

app.post('/postman', function(req, res) {
	res.send("hello");
	io.emit('test', data);
});

app.post('/postman2', function(req, res) {
	res.send("hello2");
	io.emit('test', data2);
});

app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	// public path simulates publicPath of config file
	publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

console.log("Polling server is running at 'http://localhost:3000'");

// Express test
app.get('/', function(req, res) {
  res.send('hello');
});


io.sockets.on('connection', function (socket) {
  console.log("connected on backend");



  // Socket test
  socket.once("echo", function (msg, callback) {
    socket.emit("echo", msg);
  });

//listening for commit from local client, then transmits to all connected clients
	socket.on('broadcastCommit', function(arg){
		console.log(arg);
		io.emit('incomingCommit', arg)
	});
});





/*************
*** O Auth ***
**************/
const options = {
  client_id: 'c0c337734c01396eb065',
  client_secret: '78269c29c0295c9d2c9da5151ca361c7dc42f2d4'
}

var oauth = require("oauth").OAuth2;
var OAuth2 = new oauth(options.client_id, options.client_secret, "https://github.com/", "login/oauth/authorize", "login/oauth/access_token");

app.get('/auth/github',function(req,res){

  res.writeHead(303, {
    Location: OAuth2.getAuthorizeUrl({
      redirect_uri: 'http://localhost:3000/auth/github/callback',
      scope: "user,repo,gist"
    })
  });
  res.end();
});


app.get('/auth/github/callback',function (req, res) {
  var code = req.query.code;
  OAuth2.getOAuthAccessToken(code, {}, function (err, access_token, refresh_token) {
    if (err) {
      console.log(err);
    }
    accessToken = access_token;
    // authenticate github API
    console.log("AccessToken: "+accessToken+"\n");
    github.authenticate({
      type: "oauth",
      token: accessToken
    });
  });
  res.redirect('/');
});


module.exports = server;
