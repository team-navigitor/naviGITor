import React, { Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { BarChart } from 'react-easy-chart';


export default class LocalGraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    var data = [];
    var count = {};
    var colors = ['#318864', '#4B9777', '#65A68B', '#7EB59E', '#98C4B2', '#B2D2C5'];

    this.props.getAppState.localData.
      map(function(commit){ return new Date(commit.time * 1000).
        toString().slice(4,15);}).
          forEach(function(x) { count[x] = ( count[x] || 0 ) + 1; });

    for (var prop in count) {
      let color = Math.floor((Math.random() * 5) + 0);
      data.push( { 'x': prop, 'y': count[prop], 'color': colors[color] } );
    }

    return (

      <div className='graph-page-container'>
          <div className='graph-container'>
          <h2>Personal Commits per Day</h2>
          <p>x axis: date ~ y axis: commits</p>
            <BarChart
              axes
              grid
              margin={{top: 30, right: 0, bottom: 30, left: 100}}
              height={500}
              width={500}
              data={data}
                    />
          </div>
      </div>
    );
  }
}
