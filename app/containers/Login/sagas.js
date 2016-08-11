import { take, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { LOGIN_START, LOGIN_SUCCESS, LOGOUT, GOOGLE_LOGIN_START } from './constants';

import {
  loginSuccess,
  loginError,
  loadDatas,
} from './actions';

export function* loginSaga() {
  while(true) { // eslint-disable-line
    const action = yield take(LOGIN_START);

    const cnx = yield call(request, `/api/login?username=${action.username}&password=${action.password}`);
    if (!cnx.err) {
      yield put(loginSuccess(cnx.data, action.redirectPathname));
    } else {
      yield put(loginError(cnx.err));
    }

    yield call(request, '/api/datas', { headers: { Authorization: `Bearer ${cnx.data.token}` } });
  }
}

export function* googleLoginSaga() {
  while(true) { // eslint-disable-line
    const action = yield take(GOOGLE_LOGIN_START);
    const user = yield call(request, `/api/googleLogin?id=${action.datas.El}&email=${action.datas.Ka.hg}`);
    if (!user.err) {
      yield put(loginSuccess(user.data, action.redirectPathname));
    } else {
      yield put(loginError(user.err));
    }
  }
}

export function* onLoginSuccess() {
  while(true) { // eslint-disable-line
    const action = yield take(LOGIN_SUCCESS);

    if (action.redirectPathname) {
      yield put(push(action.redirectPathname));
    }
  }
}

export function* loadSessionStorage() {
  while(true) { // eslint-disable-line
    const action = yield take('REDUX_STORAGE_LOAD');
    if (action.payload.commandeUtilisateur) {
      yield put(loadDatas(action.payload.compteUtilisateur));
    }
  }
}

export function* onLogout() {
  while(true) {  // eslint-disable-line
    yield take(LOGOUT);
    yield put(push('/'));
  }
}

// All sagas to be loaded
export default [
  loginSaga,
  googleLoginSaga,
  onLogout,
  onLoginSuccess,
  loadSessionStorage,
];
