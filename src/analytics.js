import React, {Component} from 'react';
import $ from 'jquery'
import {BarChart} from 'react-easy-chart';

//adding comments
export default class Analytics extends Component {

  getCollection(e) {
    
    e.preventDefault();
    const days = {}
    days.time = Date.now() - ($('#daysInput').val() * 86400000)
    days.room = sessionStorage.getItem('collection')
    let chart = [];
    chart.push({x: "Colin", y: 12}, {x: "Sarah", y: 6}, {x: "Steve", y: 9}, {x: "Binh", y: 14})

    this.props.setAppState({commitsPerUser: chart})
    // $.ajax({
    //   data: days,
    //   method: 'POST',
    //   // url: 'http://localhost:3000/days',
    //   success: function(data) {
    //     let users = {};
    //     data.forEach(el => {
    //       let name = el.user.substring(1, el.user.lastIndexOf(' '))
    //       if (users[name]) users[name] ++;
    //       else users[name] = 1
    //     })
    //     let chart = [];
    //     // for (let key in users) {
    //     //   console.log('key: ', key)
    //     //   chart.push({x: key, y: users[key]})
    //     // }
    //     chart.push({x: "Colin", y: 12}, {x: "Sarah", y: 6}, {x: "Steve", y: 9}, {x: "Binh", y: 14})
    //     let jason = JSON.stringify(chart)
    //     this.props.setAppState({commitsPerUser: chart})
    //   }.bind(this)
    //})

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
      <div className='chart-container'>
        <div id='days-form-container'>
        <form id='numDays' className='days-form' onSubmit={this.getCollection.bind(this)}>
            <h5>See commits per user for the last <input id='daysInput' type='text' /> days:</h5>             
            </form>           
        </div>      
        {bar}
        </div>
    )
  }
}
