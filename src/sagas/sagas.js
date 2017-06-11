import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { ITEM_SEARCH } from '../actions/actions.js';
import axios from 'axios';

export default function* rootSaga () {
  yield all([
    watchAmazonCall(),
    watchAddWishlistCall(),
    watchRemoveWishlistCall()
    ])
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

export function* watchAddWishlistCall () {
  yield takeEvery('ADD', modifyWishlist);
}

export function* modifyWishlist (action) {
  const newList = yield call(databaseCall, action)

  yield put({
    type: 'ITEM_ADD_SUCCESS',
    newList: newList
  })
}

function databaseCall(action) { //returns the newlist, which has to update the state
  return axios.post(`/${action.type}`, {
    group_id: action.group_id,
    user_id: action.user_id,
    item_id: action.item_id
  })
  .then((res) => {
    console.log('successful add/remove', res.data);
    return res.data;
  })
  .catch((err) => {
    console.log('bad add', err);
  })
}

export function* watchRemoveWishlistCall () {
  yield takeEvery('REMOVE', modifyWishlist);
}