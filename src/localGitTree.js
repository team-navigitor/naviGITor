import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import { ipcRenderer } from 'electron';
import io from 'socket.io-client';
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

// register extension
cydagre( cytoscape, dagre );

// Socket handling for app. Must be global to current page for ipcRenderer + React
let socket = io('http://localhost:3000');
let socketRoom = null;

/* listens for an git commit event from main.js webContent.send
 then sends commit string to the server via socket.
 Also enters socketRoom after filling out form and making AJAX request */
ipcRenderer.on('parsedCommitAll', function(event, arg){
	if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
});

export default class LocalGitTree extends Component {
	constructor(props) {
		super(props);

		this._dirChoice2 = this._dirChoice2.bind(this);
		this._handleSubmit2 = this._handleSubmit2.bind(this);
	}

  _dirChoice2() {
	  ipcRenderer.send('dirChoice');
  }

  //Creates room to join when submitting repo info
	_handleSubmit2(e) {
		e.preventDefault();

		let orgName = document.getElementById('login-org2').value;
		let repoName = document.getElementById('login-repo2').value;

		if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
		socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
		socketRoom = `${orgName}.${repoName}live`;
	}

	componentDidMount() {
		let localGitNodes = [];
		let localGitEdges = [];

		ipcRenderer.on('parsedCommitAll', function(event, fullLog) {
			// loop through all local git activity, and store as nodes
			for (var i = 0; i < fullLog.length; i++) {
				// if node has merge event, add merge class to add css properties
				if (fullLog[i].event === 'commit (merge)') {
					localGitNodes.push({
						data: {
							author: fullLog[i]['author'],
							id: fullLog[i]['SHA'],
							event: fullLog[i]['event'],
							commit: fullLog[i]['message']
						},
						grabbable: false,
						classes: 'merge'
					});
				}

				// all other nodes are normal
				else if (fullLog[i].SHA) {
					localGitNodes.push({
						data: {
							author: fullLog[i]['author'],
							id: fullLog[i]['SHA'],
							event: fullLog[i]['event'],
							commit: fullLog[i]['message']
						},
						grabbable: false,
					});
				}
			}
			for (var i = 0; i < fullLog.length; i++) {
				// loop through git merge activity and connect current node with parent nodes
				if (fullLog[i].event.trim() === 'merge') {
					if(fullLog[i].parent[0] !== fullLog[i].parent[1]) {
						localGitEdges.push({
							data: {
								source: fullLog[i].parent[0],
								target: fullLog[i].parent[1]
							},
							classes: 'merge'
						});
					}
				}

				// loop through all other events and connect current node to parent node
				// else if (fullLog[i]['event'] !== 'checkout') {
				else if(!fullLog[i].event.trim() === 'merge' || !/^checkout/.test(fullLog[i]['event'])) {
					localGitEdges.push({
						data: {
							source: fullLog[i].parent[0],
							target: fullLog[i].SHA
						}
					});
				}
			}

			/* listens for an git commit event from main.js webContent.send
			 then sends commit string to the server via socket */
			ipcRenderer.on('parsedCommit', function(event, localGit){
				cy.nodes().removeClass('new');
				cy.edges().removeClass('new');

				cy.add([
					{
				    data: {
				    	id: localGit.SHA,
				    	commit: localGit.message
				    }
					},
					{
				    data: {
				    	id: 'edge ' + localGit.message,
				    	source: localGit.parent[0],
				    	target: localGit.SHA
				    }
					}
				])
				.addClass('new');

				cy.layout({
					name: 'dagre',
					animate: true,
					fit: true,
					animationDuration: 1000,
				});
			});

			dagTree();
		});


		function dagTree() {
			var cy = window.cy = cytoscape({
				container: document.getElementById('git-tree'),
				boxSelectionEnabled: false,
				autounselectify: true,
				layout: {
					name: 'dagre'
				},
				style: cytoscape.stylesheet()
				.selector('node')
				  .css({
				    'content': 'data(commit)',
				    'width': 65,
				    'height': 65,
				    'text-opacity': 0.5,
				    'text-valign': 'center',
				    'text-halign': 'right',
				    'background-image': 'https://github.com/binhxn.png',
				    'border-width': 3,
				    'background-fit': 'cover',
				    'border-color': '#ccc'
				  })
				.selector('edge')
				  .css({
				    'width': 4,
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						'line-color': '#ccc',
						'target-arrow-color': '#ccc'
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
  					'border-color': 'red',
  					'border-width': 7
				 	})
				.selector('edge.merge')
				 	.css({
				    'width': 4,
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						'line-color': 'red',
						'target-arrow-color': 'red'
				 	})
				,
				elements: {
					nodes: localGitNodes,
					edges: localGitEdges
				}
			});

			cy.on('click', 'node', function(evt) {
				let nodeEventData = evt.cyTarget._private.data;
				console.log(nodeEventData);
				console.log(nodeEventData.event);

				if (nodeEventData.event === 'commit (merge)') {

					console.log('passed conditional');
				}
			});

			cy.on('click', 'edge', function(evt) {
				let edgeEventData = evt.cyTarget._private.data;
				console.log(edgeEventData);
				console.log(edgeEventData.event);

				if (edgeEventData.event === 'commit (merge)') {

					console.log('passed conditional');
				}
			});
		};
	}

	render() {
		return (
			<div className="git-tree-container">
				<div className="git-tree-header">
					<form onSubmit={this._handleSubmit2}>
					  <input id="login-org2" placeholder="Github Org" type="text" />
					  <input id="login-repo2" placeholder="Repo Name" type="text" />
					  <button className="login-submit2" type="submit">Submit</button>
					</form>
					<button className="folder-button2" onClick = {this._dirChoice2}> Select Project Folder </button>
				</div>
				<div className="git-tree-body">
					<div id="git-tree"></div>
				</div>
			</div>
		);
	}
}
