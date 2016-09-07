// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;
var $ = require('jquery');
// import $ from 'jquery';


console.log('I am outside nodeModal');
ipcRenderer.on('nodeModalWindow', function(event, nodeEvents) {

	var test = document.getElementById('test');
	test.appendChild(nodeEvents);
	
	// $('#test').append(nodeEvents);
	// $('#test').append(JSON.parse([nodeEvents]));

	// console.log('I am nodeModal');
});


$(document).ready(function() {
});
