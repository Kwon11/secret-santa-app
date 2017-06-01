import React, { Component } from 'react';
import { connect } from 'react-redux';

class ListView extends Component {
  constructor(props) {
    super(props);
    if (this.props.groups[this.props.location.search.slice(7)]) {
      console.log('this.props is', this.props)
      this.state = {
        list: this.props.groups[this.props.location.search.slice(7)].targetWish.items
      }
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('it received props', nextProps);
    if (nextProps.groups[this.props.location.search.slice(7)]) {
      console.log('nextprops.location.search is', nextProps.location.search);
      this.setState({
        list: nextProps.groups[nextProps.location.search.slice(7)].targetWish.items
      })
    }
  }

  renderList () {//state is null here? why
    console.log('this.state in renderlist', this.state)
    return this.state.list.map((item, index) => {
      return (
          <li key={index}>{item}</li>
        )
    });
  }

  render () {
    if (this.props.groups[this.props.location.search.slice(7)]) {
      console.log('so this is where it goes wrong', this.props)
      return (
          <div>
            <h3>LIST VIEEEWWW </h3>
            <ul>
              {this.renderList()}
            </ul>
          </div>
        )
    }
    return (
      <div>
        loading a groups
      </div>
    );
  }

}

function mapStateToProps (state) {
  return ({
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(ListView);
