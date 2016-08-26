import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import qtip from 'qtip2';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import cyqtip from 'cytoscape-qtip';
import { ipcRenderer } from 'electron';

// register extension
cyqtip( cytoscape, $ );
cydagre( cytoscape, dagre );

ipcRenderer.on('parsedCommitAll', function(event, data) {
	console.log('ALL LOCAL STUFF', data);
});

export default class DagTree extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		let localGitAction;
		let localGitNodes = [];
		let localGitEdges = [];

		localGitAction = ipcRenderer.on('parsedCommit', function(event, data){
			console.log(data);

			for (var i = 0; i < data.length; i++) {
				localGitNodes.push({
					data: {
						id: data[i]
					}
				});
			}

			for (var i = 0; i < data.length; i++) {
				localGitEdges.push({
					data: {
						source: 'n0',
						target: data[i]
					}
				});
			}
		});

		$(function dagTree() {
			var cy = window.cy = cytoscape({
				container: document.getElementById('cy'),
				boxSelectionEnabled: false,
				autounselectify: true,
				layout: {
					name: 'dagre'
				},
				style: [
					{
						selector: 'node',
						style: {
							'content': 'data(id)',
							'text-opacity': 0.5,
							'text-valign': 'center',
							'text-halign': 'right',
							'background-color': '#11479e'
						}
					},
					{
						selector: 'edge',
						style: {
							'width': 4,
							'target-arrow-shape': 'triangle',
							'line-color': '#9dbaea',
							'target-arrow-color': '#9dbaea'
						}
					}
				],
				elements: {
					// nodes: localGitNodes,
					nodes: [
						//	Todo: think about how to display a new edge/node when a user joins the repository

						/** ALL SHAs (committed) will be newly created here
								If the SHA does not have a parent ID, it should be known
								that it is a new branch or commit.
						**/
						{ data: { id: 'n0' } },
						localGitNodes
						// ,
						// { data: { id: 'n1' } },
						// { data: { id: 'n2' } },
						// { data: { id: 'n3' } },
						// { data: { id: 'n4' } },
						// { data: { id: 'n5' } }
					],
					edges: localGitEdges
					// edges: [
					// 	/** There is where ongoing commits or chains will be.
					// 			When the current SHA (target) has a parent (source), 
					// 			they should link;
					// 	**/
					// 	{ data: { source: 'n0', target: 'n1' } },
					// 	{ data: { source: 'n1', target: 'n2' } },
					// 	{ data: { source: 'n1', target: 'n3' } },
					// 	{ data: { source: 'n1', target: 'n5' } }
					// ]
				},
			});

			// Hides and shows tooltop appropriately.
			cy.qtip({
				content: 'hello',
				show: {
				  event: 'mouseover'
				},
				hide: {
					when: {
					  event: 'mouseleave unfocus'
					}
				}
	    });

	  	// cy.on('mouseover', 'node', function(event) {
  	 //    var node = event.cyTarget;
  	 //    node.qtip({
				// 	content: 'hello',
				// 	show: {
				// 	  event: event.type,
				// 	},
				// 	hide: {
				// 		when: {
				// 			event: 'mouseleave unfocus'
				// 		}
				// 	}
  	 //    }, event);
	  	// });
		});
	}

	render() {
		return (
			<div id="cy"></div>
		);
	}
}