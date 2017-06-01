import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  activeUser: ((state = 'it just cant') => state),
  groups: ((state = 'return undefined in initial run') => state)
})

export default rootReducer

