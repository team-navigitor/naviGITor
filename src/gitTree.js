import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import { ipcRenderer } from 'electron';
import dagTree from './createLocalGitTree';

cydagre( cytoscape, dagre );

const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

export default class GitTree extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let gitTreeId = 'global-git-tree',
				globalGitHistory = this.props.getAppState.globalData,
				globalGitNodes = [],
				globalGitEdges = [];

		// loop through all local git activity, and store as nodes
		for (var i = 0; i < globalGitHistory.length; i++) {
			// if node has merge event, add merge class to add css properties
			if (globalGitHistory[i].event === 'commit (merge)') {
				globalGitNodes.push({
					data: {
						ancestor: globalGitHistory[i]['parent'][0],
						author: globalGitHistory[i]['user'],
						id: globalGitHistory[i]['SHA'],
						event: globalGitHistory[i]['eventType'],
						commit: globalGitHistory[i]['message'],
						nameAndMessage: globalGitHistory[i]['user'] + ': ' + globalGitHistory[i]['message']
					},
					grabbable: false,
					classes: 'merge'
				});
			}

			// all other nodes are normal
			else if (globalGitHistory[i].SHA) {
				globalGitNodes.push({
					data: {
						ancestor: globalGitHistory[i]['parent'][0],
						author: globalGitHistory[i]['user'],
						id: globalGitHistory[i]['SHA'],
						event: globalGitHistory[i]['eventType'],
						commit: globalGitHistory[i]['message'],
						nameAndMessage: globalGitHistory[i]['user'] + ': ' + globalGitHistory[i]['message']
					},
					grabbable: false,
				});
			}
		}
		for (var i = 0; i < globalGitHistory.length; i++) {
			// loop through git merge activity and connect current node with parent nodes
			if (globalGitHistory[i].event === 'merge') {
				if(globalGitHistory[i].parent[0] !== globalGitHistory[i].parent[1]) {
					globalGitEdges.push({
						data: {
							source: globalGitHistory[i].parent[0],
							target: globalGitHistory[i].parent[1]
						}
					});
				}
			}
			// if committed a fixed merge conflict, add merge class to edges
			else if (globalGitHistory[i].event === 'commit (merge)') {
				globalGitEdges.push({
					data: {
						source: globalGitHistory[i].parent[0],
						target: globalGitHistory[i].SHA
					},
					classes: 'merge'
				});
			}

			// loop through all other events and connect current node to parent node
			// else if (globalGitHistory[i]['event'] !== 'checkout') {
			else if(!globalGitHistory[i].event === 'merge' || !/^checkout/.test(globalGitHistory[i]['event'])) {
				globalGitEdges.push({
					data: {
						source: globalGitHistory[i].parent[0],
						target: globalGitHistory[i].SHA
					}
				});
			}
		}

		/* listens for an git commit event from main.js webContent.send
		 then sends commit string to the server via socket */
		ipcRenderer.on('incomingCommit', function(event, incomingGit){
			cy.nodes().removeClass('new');
			cy.edges().removeClass('new');

			cy.add([
				{
			    data: {
			    	id: incomingGit.SHA,
			    	commit: incomingGit.message
			    }
				},
				{
			    data: {
			    	id: 'edge ' + incomingGit.message,
			    	source: incomingGit.parent[0],
			    	target: incomingGit.SHA
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

		dagTree(gitTreeId, globalGitNodes, globalGitEdges);
	}

	render() {
		return (
			<div className="git-tree-container">
				<div className="git-tree-body">
					<div id="global-git-tree"></div>
				</div>
			</div>
		);
	}
}
