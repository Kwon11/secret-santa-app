import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {

  render () {
    return (
        <nav>
          <ul className="NavBar">
            <li className="NavBarLink"><Link to='/TargetWishlist'>Target's Wishlist</Link></li>
            <li className="NavBarLink"><Link to='/UserWishlist'>Your Wishlist</Link></li>
            <li className="NavBarLink"><Link to='/GroupDetail'>Group Details</Link></li>
            <li className="NavBarLink"><Link to='/Chat'>Chat</Link></li>
            <li className="NavBarLink"><Link to='/Settings'>Settings</Link></li>
          </ul>
        </nav>
      )
  }
}
