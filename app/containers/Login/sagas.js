import { take, put, call, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import moment from 'moment';
import { push } from 'react-router-redux';
import { findActionType } from '../../utils/asyncSagaConstants';
import { loginConst, registerConst, LOGOUT } from './constants';
import { addEffect } from './actions';

import { addMessage } from 'containers/App/actions';

import {
  accountLoaded,
  loadAccountError,
  storeStellarKeys,
} from 'containers/CompteUtilisateur/actions';

// import {
//   selectPayments
// } from 'containers/CompteUtilisateur/selectors';
//
// import {
//   saveAccountConst,
// } from 'containers/CompteUtilisateur/constants';

import api from '../../utils/stellarApi';

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
function effects(accountId) { // accountId
  const server = api.getServer();
  return eventChannel((emitter) => { // eslint-disable-line
    return server
      .effects()
      .forAccount(accountId)
      .stream({
        onmessage: (txResponse) => txResponse
                                    .operation()
                                    .then((op) => {
                                      op.transaction()
                                        .then((trx) => {
                                          emitter({ op, trx });
                                        });
                                    }),
        onerror: (err) => console.log(err), // eslint-disable-line
      });
  });
}

export function* onLoginSuccess() {
  while(true) { // eslint-disable-line
    const action = yield take(findActionType('login', loginConst, 'SUCCESS'));
    if (action.datas.user.stellarKeys) {
      yield fork(loadAccountSaga, action.datas.user.stellarKeys.adresse);
    }
    const user = action.datas.user;
    if (user.relaiId) {
      if (!user.nom) {
        yield put(push(`/users/${user.id}/profile?tab=profil`));
      }
      yield put(push('/')); // /relais/${user.relaiId}/commandes
    } else {
      yield put(push('/choixrelais'));
    }
  }
}

export function* onRegisterSuccess() {
  while(true) { // eslint-disable-line
    yield take(findActionType('register', registerConst, 'SUCCESS'));
    yield put(push('/choixrelais'));
  }
}

export function* loadAccountOnWalletCreation() {
  while(true) { // eslint-disable-line
    const action = yield take('WS/STELLAR_WALLET_UTILISATEUR');
    yield put(storeStellarKeys(action.datas.stellarKeys));
    yield fork(loadAccountSaga, action.datas.stellarKeys.adresse);
  }
}

export function* onFirstLoginSaved() {
  while(true) { // eslint-disable-line
    const action = yield take('WS/FIRST_PROFILE_SAVED');
    yield put(push(`/accueil/${action.datas.relaiId}`));
  }
}

export function* listenStellarPaymentsOnLoginSuccess() {
  const action = yield take(findActionType('login', loginConst, 'SUCCESS'));
  const channel = effects(action.datas.user.stellarKeys.adresse);
  while(true) { // eslint-disable-line
    const effect = yield take(channel);
    yield put(addEffect(effect));
    const since = moment().diff(moment(effect.trx.created_at), 'minutes');
    if (since < 2) {
      yield put(addMessage({ type: 'success', text: 'nouveau paiement' }));
    }
  }
}

export function* loadAccountSaga(accountId) {
  try {
    const account = yield call(api.loadAccount, accountId);
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
  onFirstLoginSaved,
  onLogout,
  onLoginSuccess,
  onRegisterSuccess,
  loadAccountOnWalletCreation,
  listenStellarPaymentsOnLoginSuccess,
];
