import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class EditList extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
          <ul>
          <li><form><label>Search For Amazon Items</label><input></input></form></li>
          <li>this.renderList method for when this has search</li>
          <li> or put that in a whole new component </li>
          </ul>
        </div>
      )
  }
}

function mapStateToProps(state) {
  return ({
    groups: state.groups
  })
}

export default connect(mapStateToProps)(EditList);
