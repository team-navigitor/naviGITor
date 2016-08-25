import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import cydagre from 'cytoscape-dagre';
import dagre from 'dagre';
import $ from 'jquery';

// register extension
cydagre( cytoscape, dagre );

export default class DagTree extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		$(function(){
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
					nodes: [
						//	Todo: think about how to display a new edge/node when a user joins the repository

						/** ALL SHAs (committed) will be newly created here
								If the SHA does not have a parent ID, it should be known
								that it is a new branch or commit.
						**/
						{ data: { id: 'n0' } },
						{ data: { id: 'n1' } },
						{ data: { id: 'n2' } },
						{ data: { id: 'n3' } },
						{ data: { id: 'n4' } },
						{ data: { id: 'n5' } },
						{ data: { id: 'n6' } },
						{ data: { id: 'n7' } },
						{ data: { id: 'n8' } },
						{ data: { id: 'n9' } },
						{ data: { id: 'n10' } },
						{ data: { id: 'n11' } },
						{ data: { id: 'n12' } },
						{ data: { id: 'n13' } },
						{ data: { id: 'n14' } },
						{ data: { id: 'n15' } },
						{ data: { id: 'n16' } }
					],
					edges: [
						/** There is where ongoing commits or chains will be.
								When the current SHA (target) has a parent (source), 
								they should link;
						**/
						{ data: { source: 'n0', target: 'n1' } },
						{ data: { source: 'n1', target: 'n2' } },
						{ data: { source: 'n1', target: 'n3' } },
						{ data: { source: 'n1', target: 'n5' } },
						{ data: { source: 'n4', target: 'n6' } },
						{ data: { source: 'n6', target: 'n7' } },
						{ data: { source: 'n6', target: 'n8' } },
						{ data: { source: 'n8', target: 'n9' } },
						{ data: { source: 'n7', target: 'n9' } },
						{ data: { source: 'n8', target: 'n10' } },
						{ data: { source: 'n11', target: 'n12' } },
						{ data: { source: 'n12', target: 'n13' } },
						{ data: { source: 'n13', target: 'n14' } },
						{ data: { source: 'n13', target: 'n15' } },
					]
				},
			});
		});
	}

	render() {
		return (
			<div id="cy"></div>
		);
	}
}