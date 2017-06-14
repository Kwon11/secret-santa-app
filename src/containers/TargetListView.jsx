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

  renderList () {
    console.log('this.state.list', this.state.list)
    if (this.state.list === undefined) {
      return <div> Your receipient has yet to add items to their list! </div>
    }
    if (typeof this.state.list === 'string') {
      console.log('recognize its a string');
      return <div> {this.state.list}</div>
    } else if (this.state.list.length === 1) {
      return (
        <AmazonItem key={this.state.list.ASIN} type={'BUY'} group_id={this.props.location.search.slice(7)} user_id={this.props.activeUserId} item={this.state.list}/>
        )
    }
    return this.state.list.map((item, index) => {
      return (
          <AmazonItem key={item.ASIN} type={'BUY'} group_id={this.props.location.search.slice(7)} user_id={this.props.activeUserId} item={item}/>
        )
    });
  }

  render () {
    if (this.props.groups[this.props.location.search.slice(7)]) {
      return (
          <div>
            <h3>{this.props.groups[this.props.location.search.slice(7)].targetName}'s Wishlist</h3>
            <ul className="Wishlist">
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
