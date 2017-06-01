import React, { Component } from 'react';
import { connect } from 'react-redux';

class ListView extends Component {
  constructor(props) {
    super(props);
    if (this.props.groups) {
      this.state = {
        list: this.props.groups[this.props.location.search.slice(7)].targetWish.items
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groups) {
      this.setState({
        list: nextProps.groups[nextProps.location.search.slice(7)].targetWish.items
      })
    }
  }

  renderList () {
    return this.state.list.map((item, index) => {
      return (
          <li key={index}>{item}</li>
        )
    });
  }

  render () {
    return (
        <div>
          <h3>LIST VIEEEWWW </h3>
          <ul>
            {this.renderList()}
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

export default connect(mapStateToProps)(ListView);
