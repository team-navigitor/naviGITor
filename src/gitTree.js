import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import { ipcRenderer } from 'electron';
import io from 'socket.io-client';

// Socket handling for app. Must be global to current page for ipcRenderer + React
let socket = io('http://localhost:3000');
let socketRoom = null;


/* listens for an git commit event from main.js webContent.send
 then sends commit string to the server via socket.
 Also enters socketRoom after filling out form and making AJAX request */
ipcRenderer.on('parsedCommit', function(event, arg){
	if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
});

/**
* @data - broadcasted git event from other user
**/
// Try and move this to componentDidMount or handleSubmit tomorrow
socket.on('incomingCommit', function(data){
	console.log('broadcast loud and clear: ' + data);
});

// if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
// socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
// socketRoom = `${orgName}.${repoName}live`;


// register extension
cydagre( cytoscape, dagre );

export default class GitTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			commits: []
		}

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

		// Not really using this GET request, may need to switch it with database uri
		// $.get(`https://api.github.com/repos/${orgName}/${repoName}/commits`, function(commits) {
		// 	this.setState({
		// 		commits: commits
		// 	});

		// 	console.log('Made get request', commits);

		// }.bind(this));
		if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
		socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
		socketRoom = `${orgName}.${repoName}live`;
	}

	componentDidMount() {
		let incomingGitNodes = [];
		let incomingGitEdges = [];

		/** Steve enters the room
		*   He then makes a Git action
		*   incomingCommit will listen to ANY CHANGES and REFRESH the entire page
		*
		*   TODO:
		*   1. If tree is visible, load tree once and not load any more data
		*   2. Then add any incoming nodes with cy.add();
		**/

		socket.on('incomingCommit', function(data){
			var incomingData = JSON.parse(data);
			console.log('broadcast loud and clear: ' + incomingData);

			if (!Array.isArray(incomingData)) {
				cy.add([
					{
				    data: {
				    	id: incomingData.SHA,
				    	commit: incomingData.message
				    }
					},
					{
				    data: {
				    	id: 'edge ' + incomingData.message,
				    	source: incomingData.parent[0],
				    	target: incomingData.SHA
				    }
					}
				]);

				cy.layout({
					name: 'dagre',
					animate: true,
					fit: true,
					animationDuration: 1000,
				});
			} else {
				// loop through all local git activity, and store as nodes
				for (var i = 0; i < incomingData.length; i++) {
					incomingGitNodes.push({
						data: {
							id: incomingData[i].SHA,
							commit: incomingData[i].message
						}
					});
				}

				for (var i = 0; i < incomingData.length; i++) {
					// loop through git merge activity and connect current node with parent nodes
					if (incomingData[i]['event'] === 'merge' && incomingData[i]['event'] !== 'checkout') {
						console.log('entered merge');
						incomingGitEdges.push({
							data: {
								source: incomingData[i].parent[0],
								target: incomingData[i].SHA
							}
						},{
							data: {
								source: incomingData[i].parent[1],
								target: incomingData[i].SHA
							}
						});
					}

					// loop through all other events and connect current node to parent node
					if (incomingData[i]['event'] !== 'checkout') {
						incomingGitEdges.push({
							data: {
								source: incomingData[i].parent[0],
								target: incomingData[i].SHA
							}
						});
					}
				}
			}

			dagTree();
		});


		function dagTree() {
			var cy = window.cy = cytoscape({
				container: document.getElementById('global-git-tree'),
				boxSelectionEnabled: false,
				autounselectify: true,
				layout: {
					name: 'dagre'
				},
				style: [
					{
						selector: 'node',
						style: {
							'content': 'data(commit)',
							'text-opacity': 0.5,
							'text-valign': 'center',
							'text-halign': 'right',
							'background-image': 'https://github.com/Harla101.png',
							'background-color': '#11479e'
						}
					},
					{
						selector: 'edge',
						style: {
							'width': 4,
							'curve-style': 'bezier',
							'target-arrow-shape': 'triangle',
							'line-color': '#9dbaea',
							'target-arrow-color': '#9dbaea'
						}
					}
				],
				elements: {
					nodes: incomingGitNodes,
					edges: incomingGitEdges
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
					<div id="global-git-tree"></div>
				</div>
			</div>
		);
	}
}
