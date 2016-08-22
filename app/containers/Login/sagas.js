import { take, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { get } from 'utils/apiClient';
import { findActionType } from 'utils/asyncSagaConstants';
import { loginConst, LOGOUT, GOOGLE_LOGIN_START } from './constants';

import {
  loginSuccess,
  loginError,
} from './actions';

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

export function* onLoginSuccess() {
  while(true) { // eslint-disable-line
    const action = yield take(findActionType('login', loginConst, 'SUCCESS'));

    if (action.req.redirectPathname) {
      yield put(push(action.req.redirectPathname));
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
