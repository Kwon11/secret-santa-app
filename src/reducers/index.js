import { combineReducers } from 'redux'
import itemSearchReducer from './itemSearchReducer.js';
import groupsReducer from './groupsReducer.js';

const rootReducer = combineReducers({
  activeUserId: ((state='whaaaa activeuserid') => state),
  activeUser: ((state = 'it just cant') => state),
  groups: groupsReducer,//this reducer that updates groups.key.wishlist when action comes
  searchResult: itemSearchReducer
})

export default rootReducer

