import cytoscape from 'cytoscape';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import { ipcRenderer } from 'electron';

cydagre( cytoscape, dagre );

export default function createGitTree(gitTreeId, gitNodes, gitEdges) {
	var cy = window.cy = cytoscape({
		container: document.getElementById(gitTreeId),
		boxSelectionEnabled: false,
		autounselectify: true,
		layout: {
			name: 'dagre'
		},
		style: cytoscape.stylesheet()
		.selector('node')
		  .css({
		    'content': 'data(nameAndMessage)',
		    'width': 65,
		    'height': 65,
		    'text-opacity': 0.5,
		    'text-valign': 'center',
		    'text-halign': 'right',
		    'border-width': 3,
		    'background-fit': 'cover',
		    'border-color': '#c0e8d8'
		  })
		.selector('edge')
		  .css({
		    'width': 4,
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				'line-color': '#c0e8d8',
				'target-arrow-color': '#c0e8d8'
		  })
		.selector('node.new')
		  .css({
		    'border-style': 'double',
				'border-color': '#19C383',
				'border-width': 7,
				'line-color': '#19C383',
				'target-arrow-color': '#19C383',
				'color': '#19C383'
		  })
		.selector('edge.new')
		  .css({
		    'width': 4,
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				'line-color': '#19C383',
				'target-arrow-color': '#19C383'
		  })
		.selector('node.merge')
		 	.css({
		    'border-style': 'double',
				'border-color': '#ff5719',
				'border-width': 7
		 	})
		.selector('edge.merge')
		 	.css({
		    'width': 4,
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				'line-color': '#ff5719',
				'target-arrow-color': '#ff5719'
		 	})
		,
		elements: {
			nodes: gitNodes,
			edges: gitEdges
		}
	});

	cy.on('click', 'node', function(evt) {
		let nodeEventData = evt.cyTarget._private.data;

		ipcRenderer.send('nodeModal', nodeEventData);
	});
};
