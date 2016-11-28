import { put, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import c from './constants';
import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';

function* loadAdminDatas() {
  // yield take(c.ASYNC_LOAD_DEPOTS_SUCCESS);
  // yield put(delay(5000));
  // yield put(loadUtilisateurs());
}

export default [
  loadAdminDatas,
];
