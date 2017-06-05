import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Dropdown, { DropdownTrigger, DropdownContent} from 'react-simple-dropdown';
import '../../node_modules/react-simple-dropdown/styles/Dropdown.css';
import { connect } from 'react-redux';

class GroupSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.temporaryStyle = {
      width: '60px',
      height: '60px',
      marginLeft: '70px',
      marginTop: '20px'
    }
  }

  renderList() {
    const list = [];
    console.log('props from renderList', this.props);
    for (var key in this.props.groups) {
      list.push(
        <li key={key} className="GroupMenuLink" onClick={this.handleClick}><Link to={`${this.props.location.pathname}?group=${key}`}>{key}</Link></li>
        )
    };
    return list;
  }

  render () {

    return (
        <Dropdown className="GroupSelector">
          <DropdownTrigger className="GroupTrigger">CurrentGroup</DropdownTrigger>
          <DropdownContent className="GroupMenu">
            <img onClick={this.handleClick} src="./LiamNeesons.png" style={this.temporaryStyle}></img>
            <ul className="GroupMenuList">
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
