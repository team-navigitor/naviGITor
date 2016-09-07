import React, {Component} from 'react';
import $ from 'jquery'

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
          if (users[el.name]) users[el.name] ++;
          else users[el.name] = 0
        })
        let chart = {data: []};
        for (let key in users) {
          chart.data.push({x: key, y: users[key]})
        }
      }
    })
  }
  render() {
    console.log('storage:', sessionStorage)
    return (
        <div id='analytics-container'>
            <h5>Get commits for the following number of days:</h5>
            <form id='numDays'>
              <input id='daysInput' type='text' />
              <button id="submitDays" onClick={this.getCollection}>submit days</button>
            </form>
        </div>
    )
  }
}
