import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  activeUser: ((state = null) => state),
  groups: ((state = null) => state)
})

export default rootReducer

