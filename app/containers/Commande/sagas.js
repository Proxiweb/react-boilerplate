import { take, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import c from 'containers/Commande/constants';

// Individual exports for testing
export function* redirectOnCommandeCreated() {
  while(1) { // eslint-disable-line
    yield take(c.ASYNC_CREATE_COMMANDE_SUCCESS);
    window.location = '/';
  }
}

export function* redirectOnProduitCreated() {
  while(1) { // eslint-disable-line
    const action = yield take(c.ASYNC_SAVE_PRODUIT_SUCCESS);
    console.log(action);
    const { datas: { id, fournisseurId } } = action;
    yield put(push(`fournisseurs/${fournisseurId}/catalogue/${id}`));
  }
}

// All sagas to be loaded
export default [
  redirectOnCommandeCreated,
  redirectOnProduitCreated,
];
