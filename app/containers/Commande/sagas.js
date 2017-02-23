import { take, put, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import c from 'containers/Commande/constants';
import { catalogueUpdated } from 'containers/Commande/actions';
import { get } from 'utils/apiClient';

// Individual exports for testing
export function* redirectOnCommandeCreated() {
  while (1) {
    // eslint-disable-line
    yield take(c.ASYNC_CREATE_COMMANDE_SUCCESS);
    window.location = '/';
  }
}

export function* redirectOnProduitCreated() {
  while (1) {
    // eslint-disable-line
    const action = yield take(c.ASYNC_SAVE_PRODUIT_SUCCESS);
    const { datas: { id, fournisseurId } } = action;
    yield put(push(`fournisseurs/${fournisseurId}/catalogue/${id}`));
  }
}

// All sagas to be loaded
export default [redirectOnCommandeCreated, redirectOnProduitCreated];
