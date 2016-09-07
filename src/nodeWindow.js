// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;
var $ = require('jquery');
// import $ from 'jquery';


console.log('I am outside nodeModal');

$(document).ready(function() {
	ipcRenderer.send('nodeModalWindowReady');
	ipcRenderer.on('nodeModalWindow', function(event, data){
		console.log('hello from modalFrminside' + data.message)
	})
});
