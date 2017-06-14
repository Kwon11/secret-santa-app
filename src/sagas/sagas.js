import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { ITEM_SEARCH } from '../actions/actions.js';
import axios from 'axios';

export default function* rootSaga () {
  yield all([
    watchAmazonCall(),
    watchAddWishlistCall(),
    watchRemoveWishlistCall(),
    watchGroupAssignCall(),
    watchGroupAccept(),
    watchInvite(),
    watchFacebookLogin()
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
  const newList = yield call(databaseCall, action);
  yield put({
    type: 'NEW_WISHLIST',
    newList: newList,
    group_id: action.group_id
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

export function* watchGroupAssignCall () {
  yield takeEvery('ASSIGN', groupAssign);
}

function groupAssign (action) {
  return axios.post('/ASSIGN', {
    group_id: action.group_id
  })
  .then ((res) => {
    console.log('successful post call assin', res);
  })
  .catch ((err) => {
    console.log('err post call assign', err)
  })

}

export function* watchGroupAccept() {
  yield takeEvery('ACCEPT', acceptCall);
}

function acceptCall (action) {
  return axios.post('/ACCEPT', {
    group_id: action.group_id,
    user_id: action.user_id
  })
  .then((res) => {
    console.log('successful post to accept', res)
  })
  .catch((err) => {
    console.log('err in accept')
  })
}

export function* watchInvite () {
  yield takeEvery('INVITE', inviteCall);
}

function inviteCall (action) {
  axios.post('/INVITE', {
    user_id: action.user_id,
    group_id: action.group_id
  })
  .then((res) => {
    console.log('success invite', res);
  })
  .catch((err) => {
    console.log('err in invitecall', err);
  })
}

export function* watchFacebookLogin() {
  yield takeEvery('FACEBOOK_LOGIN', newInitialState);
}

export function* newInitialState (action) {
  const newInitialData = yield call(facebookLoginCall, action)
  yield put ({
    type: 'LOGIN',
    data: newInitialData
  })
}

function facebookLoginCall(action) {
  return axios.get('/InitialState', { params: {activeUserId: 3}})
  .then((response) => {
    console.log('response facebooklogincall', response);
    //yield put actions here that will get interpreted by the reducers to build new initial state
    return response.data;
  })
  .catch((err) => {
    console.log('error sagas 136', err);
  })
}
