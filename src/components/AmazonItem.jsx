import React, { Component } from 'react';

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

  render () {
    return (
        <div className="AmazonItem">
          <div>{this.props.item.ItemAttributes.Title}</div>
          <div><img src={this.props.item.SmallImage.URL}></img></div>
          <div>{this.props.item.ItemAttributes.ProductGroup}</div>
          <div>{this.state.price}</div>
          <div><a href={this.props.item.DetailPageURL}></a></div>
          <button>Add To Wishlist</button>
        </div>
      );
  }
}

export default AmazonItem;
