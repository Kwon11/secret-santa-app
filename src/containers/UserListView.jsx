import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AmazonItem from '../components/AmazonItem.jsx';

class UserListView extends Component {
  constructor(props) {
    super(props);
    if (this.props.groups[this.props.location.search.slice(7)]) {
      this.state = {
        list: this.props.groups[this.props.location.search.slice(7)].userWishlist
      }
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groups[nextProps.location.search.slice(7)]) {
      this.setState({
        list: nextProps.groups[nextProps.location.search.slice(7)].userWishlist
      })
    }
  }

  renderList () {
    return this.state.list.map((item, index) => {
      return (
          <AmazonItem key={item.ASIN} type={'REMOVE'} group_id={this.props.location.search.slice(7)} user_id={this.props.activeUserId} item={item}/>
        )
    });
  }

  render () {
    if (this.props.groups[this.props.location.search.slice(7)]) {
      return (
          <div>
            <h3>Your list for {this.props.groups[this.props.location.search.slice(7)].groupname} </h3>
            <Link to={`/EditList${this.props.location.search}`} className="addItemsButton">Add Items </Link>
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



export default connect(mapStateToProps)(UserListView);
