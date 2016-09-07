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
          console.log('el', el)
          let name = el.user.substring(1, el.user.lastIndexOf(' '))
          if (users[name]) users[name] ++;
          else users[name] = 1
        })
        console.log('users: ', users)
        let chart = {data: []};
        for (let key in users) {
          console.log('key: ', key)
          chart.data.push({x: key, y: users[key]})
        }
        console.log('chart: ', chart)
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
