import { take, put, call, cancelled, fork } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import moment from 'moment';
import { push } from 'react-router-redux';
import { findActionType } from '../../utils/asyncSagaConstants';
import { loginConst, LOGOUT } from './constants';
import { addEffect } from './actions';

import { addMessage } from 'containers/App/actions';

import {
  accountLoaded,
  loadAccountError,
} from 'containers/CompteUtilisateur/actions';

import {
  selectPayments
} from 'containers/CompteUtilisateur/selectors';

import {
  LOAD_ACCOUNT,
} from '../CompteUtilisateur/constants';

import api from '../../utils/stellarApi';

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
function effects() { // accountId
  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  return eventChannel((emitter) => { // eslint-disable-line
    return server
      .effects()
      .forAccount('GAPRF7NV7D2HBXZCLTT4G6U3I4BAF2YYZZCWQ7NIBOBMOD6CZGW6RLQJ')
      .order('desc')
      .stream({
        onmessage: (txResponse) => txResponse
                                    .operation()
                                    .then((op) => {
                                      op.transaction()
                                        .then((trx) => {
                                          console.log('new trx', trx);
                                          emitter({ op, trx });
                                        });
                                    }),
        onerror: (err) => console.log(err),
      });
  });
}

export function* onLoginSuccess() {
  while(true) { // eslint-disable-line
    const action = yield take(findActionType('login', loginConst, 'SUCCESS'));
    yield fork(loadAccountSaga, action.datas.user.stellarKeys.adresse);
    if (action.req.redirectPathname) {
      yield put(push(action.req.redirectPathname));
    }
  }
}

export function* listenStellarPaymentsOnLoginSuccess() {
  const action = yield take(findActionType('login', loginConst, 'SUCCESS'));
  const channel = effects(action.datas.user.stellarKeys.adresse);
  // const chan = yield call(effects, accountId);
  // try {
    while(true) { // eslint-disable-line
      const effect = yield take(channel);
      yield put(addEffect(effect));
      // const since = moment().diff(moment(effect.trx.created_at), 'minutes');
      // if (since < 2) {
      //   yield put(addMessage({ type: 'success', text: 'nouveau paiement' }));
      // }
    }
  // }
  // finally {
  //   if (yield cancelled()) {
  //     chan.close();
  //   }
  // }
}

// 2 a 10
// 1 mona 25
// 1 mona 10


export function* loadAccountSaga(accountId) {
  const env = 'public'; // yield select(selectEnv());
  try {
    const account = yield call(api.loadAccount, env, accountId);
    yield put(accountLoaded(account));
  } catch (err) {
    yield put(loadAccountError(err));
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
  listenStellarPaymentsOnLoginSuccess,
];
