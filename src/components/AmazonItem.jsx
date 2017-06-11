import React, { Component } from 'react';
import { itemClick } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//this.props.type: ['REMOVE', 'ADD', 'BUY']

class AmazonItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      price: 'Price Summary not available, visit the main link'
    }
    if (props.item.OfferSummary) {
      this.state.price = props.item.OfferSummary.LowestNewPrice.FormattedPrice;
    }
  }

  //ADD
  //REMOVE
    //both are post requests with the item, and an action
    //if 10, something.
  //BUY


  render () {
    return (
        <div className="AmazonItem">
          <div>{this.props.item.ItemAttributes.Title}</div>
          <div><img src={this.props.item.SmallImage.URL}></img></div>
          <div>{this.props.item.ItemAttributes.ProductGroup}</div>
          <div>{this.state.price}</div>
          <div><a href={this.props.item.DetailPageURL}></a></div>
          <button onClick={() => this.props.itemClick(this.props.type, this.props.item, this.props.group_id, this.props.user_id)}>{this.props.type} To Wishlist</button>
        </div>
      );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    itemClick: itemClick
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(AmazonItem);
