import React, { Component } from 'react';


export default class Visualization extends Component {

	render() {
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
		} else {
			commits = null;
		}

		return (
			<div className="commits-container">

					<div className="flexbox-parent">
					  <div className="flexbox-item-grow">
							<div className="flexbox-item-grow">

					       <div className="panel panel-default">
						       <div className="panel-heading">
							       <h5 className="panel-title">Commit Visualization</h5>
						       </div>
						       <div className="panel-body">
							       <ul> { commits } </ul>
						       </div>
					       </div>
					    </div>
					  </div>
					</div>
			</div>
		)
	}
}