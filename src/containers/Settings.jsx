import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { invite } from '../actions/actions.js';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //show your secret key
  //invite
  handleChange (event) {
    event.preventDefault();
    this.setState({user_id: event.target.value})
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.invite(this.state.user_id, this.props.location.search.slice(7));
  }


  render () {
    return (
        <div>
          <div> Your invite code: {this.props.activeUserId}</div>
          <form onSubmit={(event) => this.handleSubmit(event)}>
            <label></label>
            <input value={this.state.user_id} onChange={this.handleChange} placeholder="Enter another user's invite code to invite to this group!"></input>
          </form>
        </div>
      )
  }

}

function mapStateToProps (state) {
  return ({
    activeUserId: activeUserId
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    invite: invite
  }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Settings);
