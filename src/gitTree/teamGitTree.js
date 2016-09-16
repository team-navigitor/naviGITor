import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import $ from 'jquery';
// import cydagre from 'cytoscape-dagre';
// import dagre from 'dagre';
import { ipcRenderer } from 'electron';
import createGitTree from './createGitTree';

// cydagre( cytoscape, dagre );

const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

export default class TeamGitTree extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let gitTreeId = 'team-git-tree',
				teamGitHistory = this.props.getAppState.teamData,
				teamGitNodes = [],
				teamGitEdges = [];

		// loop through all local git activity, and store as nodes
		for (var i = 0; i < teamGitHistory.length; i++) {

			// if node has merge event, add merge class to add css properties
			if (teamGitHistory[i].eventType === 'commit (merge)') {
				teamGitNodes.push({
					data: {

						ancestor: teamGitHistory[i]['parent'][0],
						author: teamGitHistory[i]['user'],
						id: teamGitHistory[i]['SHA'],
						event: teamGitHistory[i]['eventType'],
						commit: teamGitHistory[i]['message'],
						nameAndMessage: teamGitHistory[i]['user'] + ': ' + teamGitHistory[i]['message']
					},
					grabbable: false,
					classes: 'merge'
				});
			}

			// all other nodes are normal
			else if (teamGitHistory[i].SHA) {
				teamGitNodes.push({
					data: {
						ancestor: teamGitHistory[i]['parent'][0],
						author: teamGitHistory[i]['user'],
						id: teamGitHistory[i]['SHA'],
						event: teamGitHistory[i]['eventType'],
						commit: teamGitHistory[i]['message'],
						nameAndMessage: teamGitHistory[i]['user'] + ': ' + teamGitHistory[i]['message'],
						diff: teamGitHistory[i]['diff'],
						diffStats: teamGitHistory[i]['diffStats'],
						bg: teamGitHistory[i]['avatarUrl'],
						date: new Date(teamGitHistory[i]['time'] * 1000).toString().slice(0,15),
						time: new Date(teamGitHistory[i]['time'] * 1000).toString().slice(16,21)
					},
					grabbable: false,
				});
			}
		}
		for (var i = 0; i < teamGitHistory.length; i++) {
			// loop through git merge activity and connect current node with parent nodes
			if (teamGitHistory[i].eventType === 'merge') {
				if(teamGitHistory[i].parent[0] !== teamGitHistory[i].parent[1]) {
					teamGitEdges.push({
						data: {
							source: teamGitHistory[i].parent[0],
							target: teamGitHistory[i].parent[1]
						}
					});
				}
			}

			// if committed a fixed merge conflict, add merge class to edges
			else if (teamGitHistory[i].eventType === 'commit (merge)') {
				teamGitEdges.push({
					data: {
						source: teamGitHistory[i].parent[0],
						target: teamGitHistory[i].SHA
					},
					classes: 'merge'
				});
			}

			// loop through all other events and connect current node to parent node
			else if(!teamGitHistory[i].eventType === 'merge' || !/^checkout/.test(teamGitHistory[i]['event'])) {
				teamGitEdges.push({
					data: {
						source: teamGitHistory[i].parent[0],
						target: teamGitHistory[i].SHA
					}
				});
			}
		}

		/**
		 * Listens for git commit event - 'newGlobalGitNode' - from index.js
		 * @param {String} - event
		 * @param {Object} - incomingGit
		 */
		ipcRenderer.on('newGlobalGitNode', function(event, incomingGit){
			cy.nodes().removeClass('new');
			cy.edges().removeClass('new');

			cy.add([
				{
			    data: {
			    	ancestor: incomingGit['parent'][0],
			    	author: incomingGit['user'],
			    	id: incomingGit['SHA'],
			    	event: incomingGit['event'],
			    	commit: incomingGit['message'],
			    	nameAndMessage: incomingGit['user'] + ': ' + incomingGit['message'],
						diff: incomingGit['diff'],
						diffStats: incomingGit['diffStats'],
						bg: incomingGit['avatarUrl'],
						date: new Date(incomingGit['time'] * 1000).toString().slice(0,15),
						time: new Date(incomingGit['time'] * 1000).toString().slice(16,21)
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

		createGitTree(gitTreeId, teamGitNodes, teamGitEdges);
	}

	render() {
		return (
			<div className="git-tree-container">
				<div className="git-tree-body">
					<div id="team-git-tree"></div>
				</div>
			</div>
		);
	}
}
