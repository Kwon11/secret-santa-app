import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Route } from 'react-router-dom';
import TargetListView from '../containers/TargetListView.jsx';
import UserListView from '../containers/UserListView.jsx';
import EventDetail from '../containers/EventDetail.jsx';
import Settings from '../containers/Settings.jsx';
import Chat from '../containers/Chat.jsx';
import EditList from '../containers/EditList.jsx';
import InvitationsList from '../containers/InvitationsList.jsx';

export default class MainView extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div className="MainView">
          <Route path="/" component={NavBar} />
          <div>
            <Route path="/TargetWishlist" component={TargetListView}/>
            <Route path="/UserWishlist" component={UserListView}/>
            <Route path="/GroupDetail" component={EventDetail}/>
            <Route path="/Chat" component={Chat}/>
            <Route path="/Settings" component={Settings}/>
            <Route path="/EditList" component={EditList} />
            <Route path="/Invitations" component={InvitationsList} />
          </div>
        </div>
      );
  }
}
