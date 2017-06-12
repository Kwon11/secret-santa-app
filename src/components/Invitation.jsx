import React, { Component } from 'react';

export default class Invitation extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <div>{this.props.group.groupname}</div>
          <div>Targets are assigned on {this.props.group.date_assign}</div>
          <div>Gifts should be purchsed by {this.props.group.date_due}</div>
        </div>
      )
  }
}