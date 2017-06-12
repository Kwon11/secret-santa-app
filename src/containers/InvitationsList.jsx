import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import an action that fires off a 'INVITATION ACCEPTED', withpayload group_id and user_id
import Invitation from '../components/Invitation.jsx';


class InvitationsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentWillReceiveProps (nextProps) {
    var newList = [];
    for (var key in nextProps) {
      if (nextProps.groups[key].accepted == false) {
        newList.push(nextProps.groups[key]);
      }
    }
    this.setState({list: newList});
  }

  renderList() {
    if (this.state.list.length > 0) {
      var invitationsArray = this.state.list.map((element, index) => {
        return (
            <Invitation key={index} group={element} />
          )
      })
      
    } else {
      return <div> No pending invitations! </div>
    }
  }

  render () {
    return (
        <div> this will show invitations, which just reads from group_id from memberships where col "invitation_accepted" is true. When rejected, deletes this row where user_id=activeUser and group_id=group_id </div>
      )
  }
}

function mapStateToProps(state) {
  return ({
    groups:state.groups
  })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    action: () => {console.log('whatevs action')}
  }, dispatch)
}

export default connect(mapStateToProps)(InvitationsList);