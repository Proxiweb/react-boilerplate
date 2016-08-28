import { take, put, call } from 'redux-saga/effects';
import { LOAD_ACCOUNT, TRUST, PAY } from './constants';
import { loadAccount, loadAccountError, accountLoaded, paymentsLoaded, trustError, trusted, paid, payError } from './actions';
import api from 'utils/stellarApi';

export function* loadAccountSaga() {
  while(1) { // eslint-disable-line
    const action = yield take(LOAD_ACCOUNT);
    try {
      const account = yield call(api.loadAccount, action.payload.accountId);
      yield put(accountLoaded(account));
      const payments = yield call(api.loadPayments, action.payload.accountId);
      yield put(paymentsLoaded(payments));
    } catch (err) {
      yield put(loadAccountError(err));
    }
  }
}

export function* trustSaga() {
  while(1) { // eslint-disable-line
    const action = yield take(TRUST);
    try {
      const { currencyCode, maxTrust, issuer, stellarKeys } = action.payload;
      const res = yield call(api.trust, currencyCode, maxTrust, issuer, stellarKeys);
      yield put(trusted(res));
    } catch (err) {
      yield put(trustError(err));
    }
  }
}

export function* paySaga() {
  while(1) { // eslint-disable-line
    const action = yield take(PAY);
    try {
      const { destination, currency, currencyIssuer, amount, stellarKeys } = action.payload;
      const res = yield call(api.pay, destination, currency, currencyIssuer, amount, stellarKeys);
      yield put(paid(res));
      yield put(loadAccount(stellarKeys.accountId));
    } catch (err) {
      yield put(payError(err));
    }
  }
}

export default [
  paySaga,
  loadAccountSaga,
  trustSaga,
];
