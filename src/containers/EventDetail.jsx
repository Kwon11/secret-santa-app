import React, { Component } from 'react';
import { connect } from 'react-redux';
import { assign } from '../actions/actions.js';
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
      return (
          <div>
            <h3>Detail for Event {this.props.groups[this.state.selectedGroup].groupname}</h3>
            <div>Event name </div>
            <div>Gifters and Giftees are assigned {this.props.groups[this.state.selectedGroup].date_assign}</div>
            <div>Gifts should be purchased by  {this.props.groups[this.state.selectedGroup].date_due}</div>
            <div>You will all meet  {this.props.groups[this.state.selectedGroup].location}</div>
            <div> HAVE A HAPPY HOLIDAY! </div>
            <button onClick={() => this.props.assign(this.state.selectedGroup)}> ASSIGN GIFTEES! </button>
          </div>
        )
    }
    return <div> select a group! </div>
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    assign: assign
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);
