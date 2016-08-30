import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import qtip from 'qtip2';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import cyqtip from 'cytoscape-qtip';
import { ipcRenderer } from 'electron';
import ajax from 'superagent';
import navigator from 'cytoscape-navigator';


// register extension
cyqtip( cytoscape, $ );
cydagre( cytoscape, dagre );
navigator( cytoscape );


export default class GitTree extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		let localGitAction;
		let localGitNodes = [];
		let localGitEdges = [];
		let globalGitNodes = [];
		let globalGitEdges = [];
		let globalData;

		// NEED TO UPDATE LIVE ON ANY COMMIT, ONLY GRABS COMMIT WHEN OPEN DIRECTORY
		// find a way to update local changes in the data

		localGitAction = ipcRenderer.on('parsedCommitAll', function(event, data) {

			/************************
			** GLOBAL GIT ACTIVITY **
			************************/
			ajax.get('https://api.github.com/repos/team-navigitor/naviGITor/commits')
				.end((error, response) => {
					if (!error && response) {
						response.body.forEach(function(item){
							globalGitNodes.push({
								data: {
									id: item.sha
								}
							});

							// Github Merges
							// if (item.parents.length > 1) {
							// 	globalGitEdges.push({
							// 		data: {
							// 			source: item.parents[0].sha,
							// 			target: item.sha
							// 		}
							// 	},{
							// 		data: {
							// 			source: item.parents[1].sha,
							// 			target: item.sha
							// 		}
							// 	});
							// }

							// // Worry about checkout events later
							// // loop through all other events and connect current node to parent node
							// if (item[i]['event'] !== 'checkout') {
							// 	// If the node has no parent, do not attempt to connect an edge
							// 	if (item[i].parent[0] !== "0000000000000000000000000000000000000000") {
							// 		localGitEdges.push({
							// 			data: {
							// 				source: item[i].parents[0].sha,
							// 				target: item[i].sha
							// 			}
							// 		});
							// 	}
							// }
						});
					} else {
						console.log('error fetching Github data', error);
					}
				}
			);

			/***********************
			** LOCAL GIT ACTIVITY **
			***********************/
			// loop through all local git activity, and store as nodes
			for (var i = 0; i < data.length; i++) {
				localGitNodes.push({
					data: {
						id: data[i].SHA
					}
				});
			}

			for (var i = 0; i < data.length; i++) {
				// loop through git merge activity and connect current node with parent nodes
				if (data[i]['event'] === 'merge' && data[i]['event'] !== 'checkout') {
					localGitEdges.push({
						data: {
							source: data[i].parent[0],
							target: data[i].SHA
						}
					},{
						data: {
							source: data[i].parent[1],
							target: data[i].SHA
						}
					});
				}

				// loop through all other events and connect current node to parent node
				if (data[i]['event'] !== 'checkout') {
					// If the node has no parent, do not attempt to connect an edge
					if (data[i].parent[0] !== "0000000000000000000000000000000000000000") {
						localGitEdges.push({
							data: {
								source: data[i].parent[0],
								target: data[i].SHA
							}
						});
					}
				}
			}

			/* listens for an git commit event from main.js webContent.send
			 then sends commit string to the server via socket */
			ipcRenderer.on('parsedCommit', function(event, localGit){

				console.log(localGit.parent[0]);
				console.log(localGit.SHA);

				cy.add([
					{
				    data: {
				    	id: localGit.SHA
				    }
					},
					{
				    data: {
				    	id: 'edge ' + localGit.message,
				    	source: localGit.parent[0],
				    	target: localGit.SHA
				    }
					}
				]);

				cy.layout({
					name: 'dagre',
					animate: true,
					fit: true,
					animationDuration: 500,
				});

				// cy.style([
				// 	{
				// 		selector: 'data[id = "' + localGit.SHA + '"]',
				// 		style: {
				// 			'color': 'red',
				// 			'background-color': 'red'
				// 		}
				// 	}
				// ]);
			});

			dagTree();
			// globalDagTree();



			// // Hides and shows tooltop app	ropriately, not dynamic
			// cy.qtip({
			// 	content: 'hello',
			// 	show: {
			// 	  event: 'mouseover'
			// 	},
			// 	hide: {
			// 		when: {
			// 		  event: 'mouseleave unfocus'
			// 		}
			// 	}
	  //   });

	  //Needs some polishing
	  	// cy.on('mouseover', 'node', function (event) {
    //     var eid = event.cyTarget._private.data.id
    //     console.log(event.cyTarget._private.data.id);
    //     // console.log($(this));

    //     $(this).qtip({
    //       content: eid,
    //       position: {
    //         at: 'top',
    //         target: $(this)
    //       },
    //       show: {
    //         event: 'mouseover',
    //         ready: true
    //       },
    //       hide: {
    //         // fixed: true,
    //         event: 'mouseleave unfocus'
    //       }
    //     }, event); 
	   //  });
		});


		function dagTree() {
			var cy = window.cy = cytoscape({
				container: document.getElementById('cy'),
				boxSelectionEnabled: false,
				autounselectify: true,
				layout: {
					name: 'dagre',
					animate: true
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
							'curve-style': 'bezier',
							'target-arrow-shape': 'triangle',
							'target-arrow-fill': 'filled',
							'line-color': '#9dbaea',
							'target-arrow-color': '#9dbaea'
						}
					}
				],
				elements: {
					nodes: localGitNodes,
					edges: localGitEdges
				},
			});
		};

		function globalDagTree() {
			var gcy = window.gcy = cytoscape({
				container: document.getElementById('cy'),
				boxSelectionEnabled: false,
				autounselectify: true,
				layout: {
					name: 'dagre',
					animate: true
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
							'curve-style': 'bezier',
							'target-arrow-shape': 'triangle',
							'target-arrow-fill': 'filled',
							'line-color': '#9dbaea',
							'target-arrow-color': '#9dbaea'
						}
					}
				],
				elements: {
					nodes: globalGitNodes,
					edges: globalGitEdges
				},
			});
		};
	}

	render() {
		return (
			<div className="cytocontainer">
				<div id="cy"></div>
			</div>
		);
	}
}