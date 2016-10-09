import { take, put, call, cancelled, fork } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { push } from 'react-router-redux';
// import { get } from 'utils/apiClient';
import { findActionType } from '../../utils/asyncSagaConstants';
import { loginConst, LOGOUT } from './constants';
import { addEffect } from './actions';
// import api from '../../utils/stellarApi';
import StellarSdk from 'stellar-sdk';

// import {
//   loginSuccess,
//   loginError,
// } from './actions';

// export function* loginSaga() {
//   while(true) { // eslint-disable-line
//     const action = yield take(LOGIN_START);
//
//     const response = yield call(get, `/api/login?username=${action.username}&password=${action.password}`);
//     if (!response.err) {
//       yield put(loginSuccess(response.datas, action.redirectPathname));
//     } else {
//       yield put(loginError(response.err));
//     }
//   }
// }

// export function* googleLoginSaga() {
//   while(true) { // eslint-disable-line
//     const action = yield take(GOOGLE_LOGIN_START);
//     const response = yield call(get, `/api/googleLogin?id=${action.datas.El}&email=${action.datas.Ka.hg}`);
//     if (!response.err) {
//       yield put(loginSuccess(response.datas, action.redirectPathname));
//     } else {
//       yield put(loginError(response.err));
//     }
//   }
// }
//
function effects(accountId) {
  const server = new StellarSdk.Server('https://horizon.stellar.org');
  return eventChannel((emitter) => { // eslint-disable-line
    return server
      .effects()
      .forAccount(accountId)
      .order('desc')
      .stream({
        onmessage: (txResponse) => txResponse
                                    .operation()
                                    .then((op) => {
                                      op.transaction()
                                        .then((trx) => {
                                          emitter({ op, trx });
                                        });
                                    }),
        onerror: () => {},
      });
  });
}

export function* onLoginSuccess() {
  while(true) { // eslint-disable-line
    const action = yield take(findActionType('login', loginConst, 'SUCCESS'));
    yield fork(listenStellarOnLoginSuccess, action.datas.user.stellarKeys.adresse);
    if (action.req.redirectPathname) {
      yield put(push(action.req.redirectPathname));
    }
  }
}

export function* listenStellarOnLoginSuccess(accountId) {
  const chan = yield call(effects, accountId);
  try {
    while(true) { // eslint-disable-line
      const effect = yield take(chan);
      yield put(addEffect(effect));
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

export function* onLogout() {
  while(true) {  // eslint-disable-line
    const action = yield take(LOGOUT);
    yield put(push(action.redirectPathname || '/'));
  }
}

// All sagas to be loaded
export default [
  // googleLoginSaga,
  onLogout,
  onLoginSuccess,
];
