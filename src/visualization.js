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
					<div key={i}>
						<p>{ info.name }: { info.message }</p>
					</div>
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
					{ commits }
					{/* <div className="visual-body"> { commits } </div> */}
				</div>
			</div>
		)
	}
});

module.exports = Visualization;
