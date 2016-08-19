import React, { Component } from 'react';


const Terminal = React.createClass({
	// propTypes: {
	// },

	render() {

		return (
			<div className="panel panel-default terminal-container">
				<div className="panel-heading">
					<h5 className="panel-title">Terminal Container</h5>
				</div>
				<div className="panel-body">
    		{/* terminal display will go in this div */}
    		</div>
			</div>
		)
	}
});

module.exports = Terminal;
