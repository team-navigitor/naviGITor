import React, { Component } from 'react';
import { BarChart } from 'react-easy-chart';


export default class LocalGraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let data = [];
    const count = {};
    const colors = ['#318864', '#4B9777', '#65A68B', '#7EB59E', '#98C4B2', '#B2D2C5'];
    let width = 0;

    // parses through local data saved in state and returns data to graph
    this.props.getAppState.localData
      .map(function (commit) {
        return new Date(commit.time * 1000).toString().slice(4, 11)
      })
        .forEach(function (x) {
          count[x] = (count[x] || 0) + 1;
        });

    // creates graph-ready data object & assigns random color from 'colors' var to bar
    for (const prop in count) {
      const color = Math.floor((Math.random() * 5) + 0);
      data.push({ x: prop, y: count[prop], color: colors[color] });
    }

    // adjusts x axis range to number of commits
    if (data.length <= 10) { width = 500 };
    if (data.length > 10 && data.length <= 25) { width = data.length * 50 };
    if (data.length > 25) {
      width = 1000;
      data = data.slice(0, 30);
    }
    return (
      <div className="graph-page-container">
        <div className="graph-container">
          <h2>Personal Commits per Day</h2>
          <p>x axis: date ~ y axis: commits</p>
          <BarChart
            axes
            grid
            axisLabels={{ x: 'Date', y: 'Commits' }}
            margin={{ top: 30, right: 0, bottom: 30, left: 60 }}
            height={500}
            width={width}
            data={data}
          />
        </div>
      </div>
    );
  }
}

LocalGraph.propTypes = {
  getAppState: React.PropTypes.shape,
  localData: React.PropTypes.arrayOf(React.PropTypes.string),
};
