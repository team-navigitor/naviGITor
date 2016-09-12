// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;
var $ = require('jquery');
// import $ from 'jquery';


console.log('I am outside nodeModal');

$(document).ready(function() {
	ipcRenderer.send('nodeModalWindowReady');

	ipcRenderer.on('nodeModalWindow', function(event, data){
		
		$('.node-id').append(JSON.stringify(data.id));
		$('.node-parent').append(JSON.stringify(data.ancestor));
		$('.node-commit').append(JSON.stringify(data.commit));
		$('.node-author').append(JSON.stringify(data.author));
		$('.node-event').append(JSON.stringify(data.event));
		if (data.diff !== undefined) $('#nodeWindow').append('<tr><td>Diff:</td><td class="node-adds">Lines added: ' + data.diffStats.adds + '</td></tr><td class="node-eubs">Lines deleted: ' + data.diffStats.subs + '</td></tr>')
		
		console.log('hello from modalFrminside' + JSON.stringify(data));
	})
});
