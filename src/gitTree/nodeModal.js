// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;
var $ = require('jquery');
// import $ from 'jquery';


$(document).ready(function() {
	ipcRenderer.send('nodeModalWindowReady');

	ipcRenderer.on('nodeModalWindow', function(event, data){
		$('.node-commit').append(data.commit);
		$('.node-author').append(data.author);
		$('.node-event').append(data.event);
		$('.node-date').append(data.date);
		$('.node-time').append(data.time);
		if (data.diff !== undefined) $('.node-added').append(data.diffStats.adds)
		if (data.diff !== undefined) $('.node-deleted').append(data.diffStats.subs)
		console.log('hello from modalFrminside' + JSON.stringify(data));
	})

	document.getElementById("exit-button").addEventListener("click", function (e) {
		 ipcRenderer.send('closeModal');
	});

});
