import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { ITEM_SEARCH } from '../actions/actions.js';
import axios from 'axios';

export default function* rootSaga () {
  yield all([
    watchAmazonCall()])
};

export function* amazonCall (action) {
  //action has type:ITEM_SEARCH and query from user
  console.log('amazonCall got called');
  const itemData = yield call(apiCall, action.query);
  console.log('itemData is', itemData);
  yield put({
    type: 'ITEM_SEARCH_SUCCESS',
    itemData: itemData
  })
}

export function* watchAmazonCall () {
  yield takeEvery(ITEM_SEARCH, amazonCall);
}
//bundle amazonCall into rootSaga
//amazonCall listens for action.type 'AMAZON SEARCH'
  //set up EditList onSubmit to be an action dispatch

//theres an action function defined in main.js
  //all it does is (type) => store.dispatch({type})
  //dispatch an object with {type: type} through the store

function apiCall(keywords) {
  return axios.get(`/test?keywords=${keywords}`)
          .then((response) => {
              console.log('playing with promises');
              return response;
          })
}
