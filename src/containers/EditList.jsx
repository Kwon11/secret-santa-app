import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { itemSearch } from '../actions/actions.js';
import { bindActionCreators } from 'redux';

class EditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  handleChange (event) {
    event.preventDefault();
    this.setState({searchTerm: event.target.value})
    console.log(this.state.searchTerm);
  }

  renderList () {
    var list = [];
    if (this.props.searchResult) {
      for (var key in this.props.searchResult) {
        list.push(<li key={key}>{key} : {this.props.searchResult[key]}</li>)
      }
    }
    return list;
  }

  render () {
    console.log('render', this.props.searchResult)
    return (
        <div>
          <ul>
          <li>
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.itemSearch(this.state.searchTerm)
              }
            }>
              <label>Search For Amazon Items</label>
              <input value={this.state.searchTerm} className="searchBar" onChange={this.handleChange} placeholder="Search for an Item!"></input>
            </form>
          </li>
          <ul>
            {this.renderList()}
          </ul>
          <li> or put that in a whole new component </li>
          </ul>
        </div>
      )
  }
}

const mapStateToProps = (state) => {
  return ({
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
