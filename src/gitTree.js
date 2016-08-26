import React, { Component } from 'react';


export default class GitTree extends Component {
	render() {
		// let commits;
		// if (this.props.message !== []) {
		// 	let obj = this.props.message;
		// 	commits = obj.map(function(info, i){
		// 		return (
		// 			<li key={i}>
		// 				<b>{ info.name }: { info.date }</b>
		// 				<p>{ info.message }</p>
		// 			</li>
		// 		)
		// 	});
		// } else {
		// 	commits = null;
		// }

		return (
			<div className="gitTree-container">
				<h1>Git Tree</h1>
			</div>
		)
	}
}
