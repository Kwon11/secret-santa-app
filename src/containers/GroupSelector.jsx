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
    for (var key in this.props.groups) {
      list.push(
        <li key={key} className="GroupMenuLink" onClick={this.handleClick}><Link to={`${this.props.location.pathname}?group=${key}`}>{this.props.groups[key].groupname}</Link></li>
        )
    };
    return list;
  }

  render () {
    if (this.props.groups === 0) {
      return (
        <Dropdown className="GroupSelector">
          <DropdownTrigger className="GroupTrigger">CurrentGroup</DropdownTrigger>
          <DropdownContent className="GroupMenu">
            <img onClick={this.handleClick} src="./LiamNeesons.jpg" style={this.temporaryStyle}></img>
             <div> START A NEW GROUP FROM SETTINGS!</div>
          </DropdownContent>
        </Dropdown>
        )
    }
    return (
        <Dropdown className="GroupSelector">
          <DropdownTrigger className="GroupTrigger">CurrentGroup</DropdownTrigger>
          <DropdownContent className="GroupMenu">
            <img onClick={this.handleClick} src="./LiamNeesons.jpg" style={this.temporaryStyle}></img>
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
