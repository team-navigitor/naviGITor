import React, {Component} from 'react';
import $ from 'jquery'
import {BarChart} from 'react-easy-chart';

//adding comments
export default class TeamAnalytics extends Component {

  getData(e) {
    
    e.preventDefault();
    const days = {}
    let time = Math.floor((Date.now() - ($('#daysInput').val() * 8640000)) / 1000)
    let chart = [];
    let users = {}
    //chart.push({x: "Colin", y: 12}, {x: "Sarah", y: 6}, {x: "Steve", y: 9}, {x: "Binh", y: 14})
    this.props.getAppState.teamData.filter(el => {
      console.log(time)
      return el.time > time
        }).forEach(event => {
          let name = event.user.substring(1, event.user.lastIndexOf(' '))
          if (users[name]) users[name] ++;
          else users[name] = 1
        });
    for (let key in users) {
          console.log('key: ', key)
          chart.push({x: key, y: users[key]})
        }
    this.props.setAppState({commitsPerUser: chart})
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
      barWidth={20}
      axisLabels={{y: 'Commits'}}
      yTickNumber={5}
      />
  }
    return (
      <div className='chart-container'>
        <div id='days-form-container'>
        <form id='numDays' className='days-form' onSubmit={this.getData.bind(this)}>
            <h5>See commits per user for the last <input id='daysInput' type='text' /> days:</h5>             
            </form>           
        </div>      
        {bar}
        </div>
    )
  }
}
