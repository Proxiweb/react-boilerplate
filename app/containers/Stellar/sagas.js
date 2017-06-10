import { take, put, call, select } from "redux-saga/effects";
import { selectEnv } from "containers/Stellar/selectors";
import { LOAD_ACCOUNT, TRUST, PAY, FEDERATION } from "./constants";
import {
  loadAccount,
  loadAccountError,
  accountLoaded,
  paymentsLoaded,
  trustError,
  trusted,
  paid,
  payError,
  fedLookupSuccess,
  fedLookupError
} from "./actions";

import api from "../../utils/stellarApi";

// export function* logger() {
//   while (1) { // eslint-disable-line
//     const action = yield take('*');
//     console.log({action, state: select()}); // eslint-disable-line
//   }
// }

export function* loadAccountSaga() {
  while (1) {
    // eslint-disable-line
    const action = yield take(LOAD_ACCOUNT);
    const env = yield select(selectEnv());
    try {
      const account = yield call(api.loadAccount, env, action.payload.accountId);
      yield put(accountLoaded(account));
      const payments = yield call(api.loadPayments, env, action.payload.accountId);
      yield put(paymentsLoaded(payments));
    } catch (err) {
      yield put(loadAccountError(err));
    }
  }
}

export function* trustSaga() {
  while (1) {
    // eslint-disable-line
    const action = yield take(TRUST);
    const env = yield select(selectEnv());
    try {
      const { currencyCode, maxTrust, issuer, stellarKeys } = action.payload;
      const res = yield call(api.trust, env, currencyCode, maxTrust, issuer, stellarKeys);
      yield put(trusted(res));
    } catch (err) {
      yield put(trustError(err));
    }
  }
}

export function* paySaga() {
  while (1) {
    // eslint-disable-line
    const action = yield take(PAY);
    const env = yield select(selectEnv());
    try {
      const { destination, currency, currencyIssuer, amount, stellarKeys } = action.payload;
      const res = yield call(api.pay, env, destination, currency, currencyIssuer, amount, stellarKeys);
      yield put(paid(res));
      yield put(loadAccount(stellarKeys.accountId));
    } catch (err) {
      yield put(payError(err));
    }
  }
}

export function* lookupSaga() {
  while (1) {
    // eslint-disable-line
    const action = yield take(FEDERATION);
    try {
      const { fedId } = action.payload;
      const address = yield call(api.fedLookup, fedId);
      yield put(fedLookupSuccess(address, fedId));
    } catch (err) {
      yield put(fedLookupError(err));
    }
  }
}

export default [
  // logger,
  lookupSaga,
  paySaga,
  loadAccountSaga,
  trustSaga
];
