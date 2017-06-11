import { combineReducers } from 'redux'
import itemSearchReducer from './itemSearchReducer.js';

const rootReducer = combineReducers({
  activeUserId: ((state='whaaaa activeuserid') => state),
  activeUser: ((state = 'it just cant') => state),
  groups: ((state = 'return undefined in initial run') => state),
  searchResult: itemSearchReducer
})

export default rootReducer

