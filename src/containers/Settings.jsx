import React, { Component } from 'react';
import { connect } from 'react-redux';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <h3>settings page </h3>
          <div>
            Group specific things
            <ul>like
              <li>Start date/due date</li>
              <li>Add admin</li>
              <li>Notifications on chat</li>
              <li>etc</li>
            </ul>
          </div>
          <div>
            Not group specific things
            <ul>
              like
              <li>email</li>
              <li>etc</li>
            </ul>
          </div>
        </div>
      )
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(Settings);
