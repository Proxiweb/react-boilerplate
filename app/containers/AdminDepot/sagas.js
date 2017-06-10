import { put, take } from "redux-saga/effects";
import dc from "./constants";

import { loadUtilisateurs } from "containers/AdminUtilisateurs/actions";
import { loadRelais } from "containers/AdminRelais/actions";

function* loadAdminDatas() {
  yield take(dc.ASYNC_LOAD_DEPOTS_SUCCESS);
  yield put(loadUtilisateurs());
  yield put(loadRelais());
}

export default [loadAdminDatas];
