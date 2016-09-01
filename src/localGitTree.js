import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import qtip from 'qtip2';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import cyqtip from 'cytoscape-qtip';
import { ipcRenderer } from 'electron';
import io from 'socket.io-client';

// register extension
cyqtip( cytoscape, $ );
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
			// loop through all local git activity, and store as nodes
			for (var i = 0; i < data.length; i++) {
				localGitNodes.push({
					data: {
						id: data[i].SHA
					}
				});
			}

			// $(document).ready(function() {
			// 	$('data.SHA').last().css( "background-color", "red" );
			// });

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

			dagTree();
		});


		function dagTree() {
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
							'background-color': '#216e51'
						}
					},
					{
						selector: 'edge',
						style: {
							'width': 4,
							'curve-style': 'bezier',
							'target-arrow-shape': 'triangle',
							'line-color': '#42dca3',
							'target-arrow-color': '#42dca3'
						}
					}
				],
				elements: {
					nodes: localGitNodes,
					edges: localGitEdges
				},
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