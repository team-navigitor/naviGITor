import React, {Component} from 'react';
import $ from 'jquery'
import {BarChart} from 'react-easy-chart';

//adding comments
export default class TeamAnalytics extends Component {

  getCollection(e) {
    
    e.preventDefault();
    let time = Math.floor((Date.now() - ($('#daysInput').val() * 86400000)) / 1000);
    let chart = [];
    let users = {};
    this.props.getAppState.teamData.filter(el => {
      return el.time > time;
    }).forEach(elem => {
      console.log('new elem ' + elem.user)
      let name = elem.user.substring(0, elem.user.indexOf('<') - 1)
      if (users[name]) users[name]++;
      else users[name] = 1;
    })
    for (let key in users) {
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
      //barWidth={100}
      axisLabels={{y: 'Commits'}}
      yTickNumber={5}
      />
  } else {
    bar = <img height='250px' width='250px' src="./images/darknaviGitorLogo_1.png" />
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
