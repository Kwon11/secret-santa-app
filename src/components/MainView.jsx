import React, { Component } from 'react';
import NavBar from './NavBar.jsx';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('location is', this.props.location)
  }

  render () {
    return (
        <div className="MainView" onClick={() => this.handleClick()}>
          <NavBar />
        </div>
      );
  }
}
