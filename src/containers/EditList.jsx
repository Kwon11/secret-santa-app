import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { itemSearch } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
import AmazonItem from '../components/AmazonItem.jsx';

class EditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      list: []
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    event.preventDefault();
    this.setState({searchTerm: event.target.value})
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps in EditList', nextProps);
    if (nextProps.searchResult === 'searching') {
      return 'Waiting for Amazon results!'
    } else if (nextProps.searchResult !== null) {
      this.state.list = nextProps.searchResult.map((item) => {
        return <AmazonItem key={item.ASIN} type={'ADD'} group_id={this.props.location.search.slice(7)} user_id={this.props.activeUserId} item={item}/>
      })
    }
  }

  render () {
    console.log('rendered')
    return (
        <div>
          <h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.itemSearch(this.state.searchTerm)
              }
            }>
              <label>Search For Amazon Items</label>
              <input value={this.state.searchTerm} className="searchBar" onChange={this.handleChange} placeholder="Search for an Item!"></input>
            </form>
          </h3>
          <ul className="WishList">
            {this.state.list}
          </ul>
        </div>
      )
  }
}

const mapStateToProps = (state) => {
  return ({
    activeUserId: state.activeUserId,
    groups: state.groups,
    searchResult: state.searchResult
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    itemSearch: itemSearch
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditList);
