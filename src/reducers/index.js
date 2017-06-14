import { combineReducers } from 'redux'
import itemSearchReducer from './itemSearchReducer.js';
import groupsReducer from './groupsReducer.js';
import { activeUserIdReducer, activeUserNameReducer } from './activeUserReducers.js';

const rootReducer = combineReducers({
  activeUserId: activeUserIdReducer,
  activeUser: activeUserNameReducer,
  groups: groupsReducer,//this reducer that updates groups.key.wishlist when action comes
  searchResult: itemSearchReducer
})

export default rootReducer

