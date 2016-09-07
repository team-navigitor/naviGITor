import React, {Component} from 'react';
import $ from 'jquery';
import {BarChart} from 'react-easy-chart'
//import rd3 from 'react-d3-library';
//const BarChart = rd3.BarChart

export default class Analytics extends Component {

  getCollection(e) {
    e.preventDefault()
    console.log('submit firing')
    const days = {}
    days.time = Date.now() - ($('#daysInput').val() * 86400000)
    days.room = sessionStorage.getItem('collection')
    //console.log(days)
    $.ajax({
      data: days,
      method: 'POST',
      url: 'http://localhost:3000/days',
      success: function(data) {
        console.log('ajax data: ', data)
        let users = {};
        data.forEach(el => {
          console.log('el', el)
          let name = el.user.substring(1, el.user.lastIndexOf(' '))
          if (users[name]) users[name] ++;
          else users[name] = 1
        })
        console.log('users: ', users)
        let chart = [];
        // for (let key in users) {
        //   console.log('key: ', key)
        //   chart.push({x: key, y: users[key]})
        // }
        chart.push({x: "Colin", y: 12}, {x: "Sarah", y: 6}, {x: "Steve", y: 9}, {x: "Binh", y: 14})
        let jason = JSON.stringify(chart)
        console.log('chart:  ', jason)
        this.props.setAppState({commitsPerUser: chart})
      }.bind(this)
    })
  }

  render() {
    let bar = null;
      if (this.props.getAppState.commitsPerUser) {
        const style = {textAlign: 'center'}
      bar = <BarChart
      data={this.props.getAppState.commitsPerUser}
      colorBars
      height={450}
      width={500}
      margin={{top: 60, right: 30, bottom: 50, left: 70}}
      axes
      //barWidth={100}
      axisLabels={{y: 'Commits'}}
      yTickNumber={5}
      />
  }
    return (
        <div id='analytics-container'>
            <h5>Get commits for the following number of days:</h5>
            <form id='numDays'>
              <input id='daysInput' type='text' />
              <button id="submitDays" onClick={this.getCollection.bind(this)}>submit days</button>
              
            </form>
            {bar}
        </div>
    )
  }
}
