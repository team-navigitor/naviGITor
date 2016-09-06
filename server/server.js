const express = require('express');
const app = express();
const config = require('../webpack.config');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const EventController = require('../src/database/event-controller.js')
const UserController = require ('../src/database/user-controller.js')
// process.env.PORT sets to hosting service port (Heroku) or 3000
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);
const bodyParser = require ('body-parser');

app.use(bodyParser.urlencoded({extended: true}))

/************************************************
*** Development: Webpack Config/Middleware ***
**************************************************/
// hands this compiler off to the middleware for hot reloading
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	// public path simulates publicPath of config file
	publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

if (PORT === process.env.PORT) {
  app.use(express.static('./'))
} else {
  app.use(express.static('./dist'));
}

console.log('Polling server is running on http://localhost:' + PORT);


/***************************
*** Socket Handling + RxJS ***
TODO: handle subscribe/getRepo functionality on client side
****************************/

io.sockets.on('connection', function (socket) {
  // Socket test
  socket.once("echo", function (msg, callback) {
    socket.emit("echo", msg);
  });

  // room handling
  socket.on('subscribe', function(data) {
		console.log(data.room);
    EventController.getRepo(data, function(x) {
      console.log(x)
    })

    socket.join(data.room);
  });

  socket.on('unsubscribe', function(data) { socket.leave(data.room)});
  //listening for Git Action from local client, then broadcasts to all connected clients in team
	// TODO: handle callback in post method
	socket.on('broadcastGit', function(arg){
    EventController.post(arg, function(data) {
			console.log(data);
    });
		io.in(arg.room).emit('incomingCommit', arg.data);
	});

  //Chat room
  socket.on('sendMessage', function (data) {
    socket.broadcast.to(data.room).emit('sendMessage', {
      text: data.text
    });

    console.log(data.text);
  });
});

/***********************
 *** User Sign in/up ***
 ***********************/

app.post('/signup', (req, res) => {
  UserController.add(req, () => {
    console.log('hi')
  })
  //console.log('signed up')
})

app.post('/verify', (req, res) => {
  UserController.verify(req, function(data) {
    console.log('data from server: ', data)
    res.send(data)
  })
  //console.log(req)
})


/*****************
 *** Analytics ***
 *****************/

app.get('/days', (req, res) => {
  EventController.getByTime(req, function() {
  
  })
})

module.exports = server
