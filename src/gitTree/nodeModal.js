// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;
var $ = require('jquery');
// import $ from 'jquery';


$(document).ready(function() {
	ipcRenderer.send('nodeModalWindowReady');

	ipcRenderer.on('nodeModalWindow', function(event, data){
		$('.node-id').append(JSON.stringify(data.id));
		$('.node-parent').append(JSON.stringify(data.ancestor));
		$('.node-commit').append(JSON.stringify(data.commit));
		$('.node-author').append(JSON.stringify(data.author));
		$('.node-event').append(JSON.stringify(data.event));
		$('.node-date').append(JSON.stringify(data.date));
		$('.node-time').append(JSON.stringify(data.time));

		console.log('hello from modalFrminside' + JSON.stringify(data));
	})
});
