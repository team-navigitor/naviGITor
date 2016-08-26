import React, {Component} from 'react';
import { Link } from 'react-router';
// import { Nav, NavItem } from 'react-bootstrap';
// import NavBar from './navBar';

export default class NavBar extends Component {
  render() {
    return (
      <div id='main-container'>
      <div className='side-nav-bar-container'>
        <ul>
          <li><Link to='/GitTree'>GIT TREE</Link></li>
          <li><Link to='/Terminal'>TERMINAL</Link></li>
          <li><Link to='/'>LOG OUT</Link></li>
        </ul>
      </div>
      <div className='focal-area-container'>
         {this.props.children}
      </div>
      </div>
        /* <Nav bsStyle="tabs" justified activeKey={1}>
          <NavItem eventKey={1} title="Item">LOG OUT</NavItem>
          <NavItem eventKey={2} title="Item">WORKFLOW</NavItem>
          <NavItem eventKey={3} title="Item">TERMINAL</NavItem>
          <NavItem eventKey={4} title="Item">CHAT</NavItem>
        </Nav> */
    )
  }
}




// export default class Main extends Component {
//   render() {
//     return (
//       <div id='Main-Page'>
//         <NavBar />
//         <div className='focal-area-container'></div>
//         <div>
//
//         </div>
//     )
//   }
// }
//
// //
// // <div className="container_wholePage">
// //   <h1>naviGITor</h1>
// // //
// // //     <div>
// // //       <Link to="/PageOne">Click here to go page one</Link>
// // //       {this.props.children}
// // //     </div>
// // //
// // // </div>
