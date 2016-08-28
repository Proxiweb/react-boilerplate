import { take, put, call } from 'redux-saga/effects';
import { LOAD_ACCOUNT } from './constants';
import { loadAccountError, accountLoaded, paymentsLoaded } from './actions';
import api from 'utils/stellarApi';

export function* loadAccountSaga() {
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

export default [
  loadAccountSaga,
];
