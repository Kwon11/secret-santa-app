import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Route } from 'react-router-dom';
import ListView from '../containers/ListView.jsx';
import EventDetail from '../containers/EventDetail.jsx';
import Settings from '../containers/Settings.jsx';
import Chat from '../containers/Chat.jsx';

export default class MainView extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div className="MainView">
          <Route path="/" component={NavBar} />
          <div>
            <Route path="/TargetWishlist" component={ListView}/>
            <Route path="/UserWishlist" component={ListView}/>
            <Route path="/GroupDetail" component={EventDetail}/>
            <Route path="/Chat" component={Chat}/>
            <Route path="/Settings" component={Settings}/>
          </div>
        </div>
      );
  }
}
