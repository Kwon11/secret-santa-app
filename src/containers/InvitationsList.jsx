import React, { Component } from 'react';

class InvitationsList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
        <div> this will show invitations, which just reads from group_id from memberships where col "invitation_accepted" is true. When rejected, deletes this row where user_id=activeUser and group_id=group_id </div>
      )
  }
}