// import React, { Component } from 'react';
// import { Link } from 'react-router';
// import $ from 'jquery';
//
//
// export default class Graph extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//
//
//   getGraph(){
//     let data = {};
//    let orgName = this.props.getAppState.orgName;
//    let repoName = this.props.getAppState.repoName;
//   //  $.ajax.get(`https://api.github.com/repos/${orgName}/${repoName}/commits`)
//    $.ajax.get(`https://api.github.com/repos/team-navigitor/navigitor/commits`)
//     .end((error, response) => {
//       if (!error && response) {
//       let apiData = response.body.map(function(item){
//          return {
//            date: item.commit.author.date
//          }
//       }).forEach(function(date){
//         data[date] = (data[date] || 0) +1;
//       });
//        console.log(data);
//     } else {
//      console.log('error fetching Github data', error);
//      }
//    })
// }
//
//   render() {
//
//     return (
//
//       <div className='graph-container'>
//       <button className='get-graph' onClick={this.getGraph}>Commits by Day</button>
//         <BarChart
//           axes
//           colorBars
//           margin={{top: 0, right: 0, bottom: 30, left: 100}}
//           height={650}
//           width={650}
//           data={[ {x: 'A', y: 20, color: '#502c5f '},
//                   {x: 'B', y: 30, color: '#0076a3 '},
//                   {x: 'C', y: 40, color: '#7ac5cd '},
//                   {x: 'D', y: 20, color: '#f08080 '},
//                   {x: 'E', y: 5, color: '#315198 '}
//                 ]}
//                 />
//       </div>
//     );
//   }
// }
