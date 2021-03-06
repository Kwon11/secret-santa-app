import React, { Component } from 'react';
import { connect } from 'react-redux';
import { assign, accept } from '../actions/actions.js';
import { bindActionCreators } from 'redux';

class EventDetail extends Component {
  constructor(props) {
    super(props);
    console.log('props', props, props.location.search.slice(7));
    this.state = {
      selectedGroup: null
    };
    if (props.groups[props.location.search.slice(7)]) {
      this.state = {
        selectedGroup: props.location.search.slice(7),
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextprops', nextProps);
    if (nextProps.location.search.slice(7)) {
      console.log('it sets the state on nextprops')
      this.setState({
        selectedGroup: nextProps.location.search.slice(7),
      });
    }
  }

  render () {
    console.log('render state.selectedGroup', this.state.selectedGroup);
    if (this.state.selectedGroup) {
      if (this.props.groups[this.state.selectedGroup].accepted === 1 && this.props.groups[this.state.selectedGroup].admin === 1) {
        return (
            <div>
              <h3>Detail for Event {this.props.groups[this.state.selectedGroup].groupname}</h3>
              <div>Event name {this.props.groups[this.state.selectedGroup].groupname}</div>
              <div>Gifters and Giftees are assigned {this.props.groups[this.state.selectedGroup].date_assign}</div>
              <div>Gifts should be purchased by  {this.props.groups[this.state.selectedGroup].date_due}</div>
              <div>You will all meet  {this.props.groups[this.state.selectedGroup].location}</div>
              <div> HAVE A HAPPY HOLIDAY! </div>
              <button onClick={() => this.props.assign(this.state.selectedGroup)}> ASSIGN GIFTEES! </button>
            </div>
          )
      } else if (this.props.groups[this.state.selectedGroup].accepted === 1) {
        return (
            <div>
              <h3>Detail for Event {this.props.groups[this.state.selectedGroup].groupname}</h3>
              <div>Event name </div>
              <div>Gifters and Giftees are assigned {this.props.groups[this.state.selectedGroup].date_assign}</div>
              <div>Gifts should be purchased by  {this.props.groups[this.state.selectedGroup].date_due}</div>
              <div>You will all meet  {this.props.groups[this.state.selectedGroup].location}</div>
              <div> HAVE A HAPPY HOLIDAY! </div>
            </div>
          )
      } else {
        return (
          <div>
            <div> You have not yet accepted this group invitation! 
              <button onClick={() => this.props.accept(this.state.selectedGroup, this.props.activeUserId)}> Click here to accept this invitation! </button> 
            </div>
            <h3>Detail for Event {this.props.groups[this.state.selectedGroup].groupname}</h3>
              <div>Event name </div>
              <div>Gifters and Giftees are assigned {this.props.groups[this.state.selectedGroup].date_assign}</div>
              <div>Gifts should be purchased by  {this.props.groups[this.state.selectedGroup].date_due}</div>
              <div>You will all meet  {this.props.groups[this.state.selectedGroup].location}</div>
              <div> HAVE A HAPPY HOLIDAY! </div>
          </div>
          )
      }
    }
    return <div> select a group! </div>
  }

}

function mapStateToProps (state) {
  return ({
    activeUserId: state.activeUserId,
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    assign: assign,
    accept: accept
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);
