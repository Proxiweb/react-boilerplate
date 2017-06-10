import { put, select, take } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import c from "./constants";
import { selectCommandeEditDomain } from "./selectors";
import { sauvegarder } from "./actions";

// Individual exports for testing
export function* sauvegarderSaga() {
  const commande = yield select(selectCommandeEditDomain());
  yield put(sauvegarder(commande));
}

export function* setDistibutionSaga() {
  while (1) {
    // eslint-disable-line
    yield takeLatest(c.CHANGE_DISTRIBUTION, sauvegarderSaga);
  }
}

export function* redirectOnAnnuler() {
  while (1) {
    // eslint-disable-line
    try {
      yield take(c.ASYNC_ANNULER_SUCCESS);
      window.location = "/";
    } catch (e) {
      console.log(e);
    }
  }
}

// All sagas to be loaded
export default [setDistibutionSaga, redirectOnAnnuler];
