import React, { Component } from 'react';

export default class MainView extends Component {

  render () {
    return (
        <div>
          This will later hold mainView, with
          NavBar, which loads the same 4 links always
          and the Route component, which will render a
          component which matches the page part of the
          link, with the groupID part of the link as props
        </div>
      );
  }
}
