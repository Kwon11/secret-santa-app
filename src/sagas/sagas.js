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
  const itemData = yield call(apiCall, action.query);
  yield put({
    type: 'ITEM_SEARCH_SUCCESS',
    itemData: itemData
  })
}

export function* watchAmazonCall () {
  yield takeEvery(ITEM_SEARCH, amazonCall);
}

function apiCall(keywords) {
  return axios.get(`/test?keywords=${keywords}`)
          .then((response) => {
            console.log('successful call')
              return response;
          })
          .catch((error) => {
            console.log('error in apicall', error);
            return null;
          })
}
