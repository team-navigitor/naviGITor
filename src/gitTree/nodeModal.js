import { ipcRenderer } from 'electron';
import $ from 'jquery';


$(document).ready(function() {
	ipcRenderer.send('nodeModalWindowReady');

	/**
	 * Listens for node click event - 'newGlobalGitNode' - to open modal with statistics
	 * @param {String} - event
	 * @param {Object} - data
	 * @return {Object} - appends abstracted object values to HTML elements in modal
	 */
	ipcRenderer.on('nodeModalWindow', function(event, data){
		$('.node-commit').append(data.commit);
		$('.node-author').append(data.author);
		$('.node-event').append(data.event);
		$('.node-date').append(data.date);
		$('.node-time').append(data.time);
		if (data.diff !== undefined) $('.node-added').append(data.diffStats.adds);
		if (data.diff !== undefined) $('.node-deleted').append(data.diffStats.subs);
	})

	// Close Modal button
	document.getElementById("exit-button").addEventListener("click", function (e) {
		ipcRenderer.send('closeModal');
	});

});
