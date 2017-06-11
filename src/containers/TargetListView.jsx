import React, { Component } from 'react';
import { connect } from 'react-redux';
import AmazonItem from '../components/AmazonItem.jsx';

class TargetListView extends Component {
  constructor(props) {
    super(props);
    if (this.props.groups[this.props.location.search.slice(7)]) {
      this.state = {
        list: this.props.groups[this.props.location.search.slice(7)].targetWishlist
      }
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groups[nextProps.location.search.slice(7)]) {
      this.setState({
        list: nextProps.groups[nextProps.location.search.slice(7)].targetWishlist
      })
    }
  }

  renderList () {//state is null here? why
    return this.state.list.map((item, index) => {
      return (
          <AmazonItem key={index} type={'BUY'} item={item} group_id={this.props.location.search.slice(7)} user_id={this.props.activeUserId}/>
        )
    });
  }

  render () {
    if (this.props.groups[this.props.location.search.slice(7)]) {
      return (
          <div>
            <h3>{this.props.groups[this.props.location.search.slice(7)].targetName}'s Wishlist</h3>
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
    activeUserId: state.activeUserId,
    groups: state.groups //possibly state.groups[$match.url] type thing
  })
}

export default connect(mapStateToProps)(TargetListView);
