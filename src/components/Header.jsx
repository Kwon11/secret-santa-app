import React, { Component } from 'react';
import GroupSelector from '../containers/GroupSelector.jsx';



/*
DropdownTrigger: The element that will cause your dropdown to appear when clicked.
DropdownContent: Contains the "filling" of your dropdown. Generally, this is a list of links.
Dropdown: The base element for your dropdown. This contains both the DropdownTrigger and the DropdownContent, and handles communication between them.
*/

export default class Header extends Component {

	render() {
		return (
			<nav className="NavBar">
				<GroupSelector />
			</nav>
		)
	}
}