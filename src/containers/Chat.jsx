import React, { Component } from 'react';
import { connect } from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <h3>Chat </h3>
          <ul>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
            <li>message lol</li>
          </ul>
        </div>
      )
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(Chat);
