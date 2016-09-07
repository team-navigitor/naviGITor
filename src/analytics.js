import React, {Component} from 'react';
import $ from 'jquery'

export default class Analytics extends Component {

  getCollection(e) {
    e.preventDefault()
    console.log('submit firing')
    let days = {}
    days.time = $('#daysInput').val()
    days.room = sessionStorage.getItem('collection')
    $.ajax({
      data: days,
      type: 'GET',
      url: 'http://navigitorsite.herokuapp.com/days',
      success: function(data) {
        console.log(data)
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
