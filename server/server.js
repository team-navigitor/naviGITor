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
const Rx = require('rxjs/Rx');


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
io.sockets.on('connection', function(socket){
	// Room Handling
	const socketJoinRoomObservable = Rx.Observable.create(function(observer){
		socket.on('subscribe', function(data) {
			try {
				EventController.getRepo(data, function(x) {
					socket.emit('completeDBLog', x)
				})
				socket.join(data.room)
				observer.next(data.room);
			} catch (err) {
				observer.error(err);
			}
		}
		);
	})

	const socketJoinRoomObserver = socketJoinRoomObservable
		.subscribe(x => console.log('joined team: ' + x), e => 'connection error: ' + e, () => console.log('team connected complete'))

	const socketLeaveRoomObservable = Rx.Observable.create(function(observer){
		socket.on('unsubscribe', function(data) {
			try{
				socket.leave(data.room);
				observer.next(data.room);
			} catch (err) {
				observer.error(err);
			}
		});
	});

	const socketLeaveRoomObserver = socketLeaveRoomObservable
		.subscribe(x => console.log('left room: ' + x), e => console.log('error on leave: ' + e),() => console.log('left room completed'))

	// Broadcasting Git Actions from local clients to connected team members
	const socketGitBroadcastingObservable = Rx.Observable.create(function(observer){
		socket.on('broadcastGit', function(arg){
			try {
				EventController.post(arg, function(data) {
					console.log('returned from db: ' + data);
				});
				io.in(arg.room).emit('incomingCommit', arg.data);
			} catch (err) {
				observer.error(err);
			}
		});
	});

	const socketGitBroadcastingObserver = socketGitBroadcastingObservable
		.subscribe(x => console.log('broadcasted'), e => console.log(e), () => console.log('git broadcasted and saved | complete'))
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
UserController.verify(req, function(){})
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
