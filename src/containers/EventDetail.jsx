import React, { Component } from 'react';
import { connect } from 'react-redux';

class EventDetail extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <h3>Detail for Event mothafuckaaaa </h3>
          <div>Event name </div>
          <div>Event scname </div>
          <div>Event bename </div>
          <div>Event rename </div>
          <div>Event qqwname </div>

        </div>
      )
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(EventDetail);
