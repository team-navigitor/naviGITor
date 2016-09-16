import React, {Component} from 'react';
import $ from 'jquery'
import {BarChart} from 'react-easy-chart';


export default class TeamAnalytics extends Component {

/* 
  @param: (event) - click event
*/
  getEventsByTime(e) {
    
    //prevent reload on submit
    e.preventDefault();
    /*because Git stores time in seconds vs milliseconds, 
    to get events going back the number of days chosen by the user,
    we multiply that by milliseconds in a day, then divide by 1000
    */
    let time = Math.floor((Date.now() - ($('#daysInput').val() * 86400000)) / 1000),
    chart = [],
    users = {};

    //get team & repo name from state, then filter by time
    this.props.getAppState.teamData.filter(el => {
      return el.time > time;
    }).forEach(elem => {
      //parse name
      let name = elem.user.substring(0, elem.user.indexOf('<') - 1)
      //if name is in user object, increment. Otherwise add name to user object
      if (users[name]) users[name]++;
      else users[name] = 1;
    })
    //push objects into chart in format needed by react easy chart
    for (let key in users) {
      chart.push({x: key, y: users[key]})
    }
    //add chart array to state
    this.props.setAppState({commitsPerUser: chart})
  }

  render() {
    //initialize bar
    let bar = null;

    //if chart array is in state, create bar chart
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
  // if chart array isn't in state, display logo
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
