import React, { Component } from 'react';


const Visualization = React.createClass({
	// propTypes: {
	// 	message: React.PropTypes.
	// },

	render() {
		// console.log("in render: "+this.state.message)
		let commits;
			if (this.props.message !== []) {
			let obj = this.props.message;
			commits = obj.map(function(info, i){
				return (
					<li key={i}>
						<b>{ info.name }: { info.date }</b>
						<p>{ info.message }</p>
					</li>
				)
			});
		}
		else commits = null;

		return (
			<div className="panel panel-default commits-container">
				<div className="panel-heading">
					<h5 className="panel-title">Commit Visualization</h5>
				</div>
				<div className="panel-body">
					<ul> { commits } </ul>
				</div>
			</div>
		)
	}
});

module.exports = Visualization;
