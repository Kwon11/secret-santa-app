import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {

  render () {
    return (
        <nav>
          <ul className="NavBar">
            <li className="NavBarLink"><Link className="MainViewLink" to={`/TargetWishlist${this.props.location.search}`}>Target's Wishlist</Link></li>
            <li className="NavBarLink"><Link className="MainViewLink" to={`/UserWishlist${this.props.location.search}`}>Your Wishlist</Link></li>
            <li className="NavBarLink"><Link className="MainViewLink" to={`/GroupDetail${this.props.location.search}`}>Group Details</Link></li>
            <li className="NavBarLink"><Link className="MainViewLink" to={`/Chat${this.props.location.search}`}>Chat</Link></li>
            <li className="NavBarLink"><Link className="MainViewLink" to={`/Settings${this.props.location.search}`}>Settings</Link></li>
          </ul>
        </nav>
      )
  }
}
