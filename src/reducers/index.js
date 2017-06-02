import { combineReducers } from 'redux'
import itemSearchReducer from './itemSearchReducer.js';

const rootReducer = combineReducers({
  activeUser: ((state = 'it just cant') => state),
  groups: ((state = 'return undefined in initial run') => state),
  searchResult: itemSearchReducer
})

export default rootReducer

