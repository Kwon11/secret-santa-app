import React, { Component } from 'react';
import { connect } from 'react-redux';

class ListView extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <h3>LIST VIEEEWWW </h3>
        </div>
      )
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(ListView);
