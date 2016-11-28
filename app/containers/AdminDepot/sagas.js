import { put, take, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import dc from './constants';

import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import uc from 'containers/AdminUtilisateurs/constants';
import { loadRelais } from 'containers/AdminRelais/actions';
// import rc from 'containers/AdminRelais/constants';

function* loadAdminDatas() {
  yield take(dc.ASYNC_LOAD_DEPOTS_SUCCESS);
  yield call(delay, 1000);
  yield put(loadUtilisateurs());
}

function* loadAdminRelais() {
  yield take(uc.ASYNC_LOAD_UTILISATEURS_SUCCESS);
  yield call(delay, 1000);
  yield put(loadRelais());
}

export default [
  loadAdminDatas,
  loadAdminRelais,
];
