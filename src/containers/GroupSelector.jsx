import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Dropdown, { DropdownTrigger, DropdownContent} from 'react-simple-dropdown';
import '../../node_modules/react-simple-dropdown/styles/Dropdown.css';
import { connect } from 'react-redux';

class GroupSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderList() {
    const list = [];
    for (var key in this.props.groups) {
      list.push(
        <li key={key}><Link to={key}>{key}</Link></li>
        )
    };
    return list;
  }

  render () {

    return (
        <Dropdown className="GroupSelector">
          <DropdownTrigger className="GroupTrigger">CurrentGroup</DropdownTrigger>
          <DropdownContent className="GroupMenu">
            <div> image later </div>
            <ul>
              {this.renderList()}
            </ul>
          </DropdownContent>
        </Dropdown>
      )
  }
}

function mapStateToProps(state) {
  return {
    groups: state.groups
  };
}

export default connect(mapStateToProps)(GroupSelector);
