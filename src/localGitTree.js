import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import qtip from 'qtip2';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import { ipcRenderer } from 'electron';
import io from 'socket.io-client';

// register extension
cydagre( cytoscape, dagre );

// Socket handling for app. Must be global to current page for ipcRenderer + React
let socket = io('http://navigitorsite.herokuapp.com');
let socketRoom = null;

/* listens for an git commit event from main.js webContent.send
 then sends commit string to the server via socket.
 Also enters socketRoom after filling out form and making AJAX request */
ipcRenderer.on('parsedCommit', function(event, arg){
	if(socketRoom) socket.emit('broadcastGit', {'room': socketRoom, 'data': JSON.stringify(arg, null, 1)});
});

export default class LocalGitTree extends Component {
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
		$.get(`https://api.github.com/repos/${orgName}/${repoName}/commits`, function(commits) {
			this.setState({
				commits: commits
			});

			console.log('Made get request', commits);

			if(socketRoom) socket.emit("unsubscribe", { room: socketRoom });
			socket.emit("subscribe", { room: `${orgName}.${repoName}live` });
			socketRoom = `${orgName}.${repoName}live`;
		}.bind(this));
	}

	componentDidMount() {
		let localGitAction;
		let localGitNodes = [];
		let localGitEdges = [];

		localGitAction = ipcRenderer.on('parsedCommitAll', function(event, data) {
			console.log(data);
			// loop through all local git activity, and store as nodes
			for (var i = 0; i < data.length; i++) {
				localGitNodes.push({
					data: {
						id: data[i].SHA,
						label: data[i].message
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
					localGitEdges.push({
						data: {
							source: data[i].parent[0],
							target: data[i].SHA
						}
					});
				}
			}

			/* listens for an git commit event from main.js webContent.send
			 then sends commit string to the server via socket */
			ipcRenderer.on('parsedCommit', function(event, localGit){
				cy.add([
					{
				    data: {
				    	id: localGit.SHA,
				    	label: localGit.message
				    }
					},
					{
				    data: {
				    	id: 'edge ' + localGit.message,
				    	source: localGit.parent[0],
				    	target: localGit.SHA
				    }
					}
				]).style({
					'border-style': 'double',
					'border-color': '#19C383',
					'border-width': 7,
					'line-color': '#19C383',
					'target-arrow-color': '#19C383',
					'color': '#19C383'
				});

				cy.layout({
					name: 'dagre',
					animate: true,
					fit: true,
					animationDuration: 500,
				});
			});

			dagTree();

			// cy.elements().qtip({
			// 	content: 'Example qTip on ele',
			// 	position: {
			// 		my: 'top center',
			// 		at: 'bottom center'
			// 	},
			// 	style: {
			// 		tip: {
			// 			width: 16,
			// 			height: 8
			// 		}
			// 	}
			// });
		});


		function dagTree() {
			$(function() {
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
								'content': 'data(label)',
								'width': 65,
								'height': 65,
								'text-opacity': 0.5,
								'text-valign': 'center',
								'text-halign': 'right',
								'background-image': 'https://github.com/binhxn.png',
								'border-width': 3,
								'background-fit': 'cover',
								'border-color': '#ccc'
							}
						},
						{
							selector: 'edge',
							style: {
								'width': 4,
								'curve-style': 'bezier',
								'target-arrow-shape': 'triangle',
								'line-color': '#ccc',
								'target-arrow-color': '#ccc'
							}
						}
					],
					elements: {
						nodes: localGitNodes,
						edges: localGitEdges
					}
				});
			});
		};
	}

	render() {
		return (
			<div>
				<div className="git-tree-header">
					<form onSubmit={this._handleSubmit2}>
					  <input id="login-org2" placeholder="Github Org" type="text" />
					  <input id="login-repo2" placeholder="Repo Name" type="text" />
					  <button className="login-submit2" type="submit">Submit</button>
					</form>
					<button className="folder-button2" onClick = {this._dirChoice2}> Select Project Folder </button>
				</div>
				<div className="cytocontainer">
					<div id="cy"></div>
				</div>
			</div>
		);
	}
}