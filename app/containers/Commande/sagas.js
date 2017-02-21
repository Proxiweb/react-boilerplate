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

export function* updateCatalogue() {
  while (1) {
    // eslint-disable-line
    try {
      const state = yield select();
      const headers = state.compteUtilisateur.token
        ? { Authorization: `Bearer ${state.compteUtilisateur.token}` }
        : {};
      const action = yield take(c.UPDATE_CATALOGUE_START);
      const query = { relaiId: action.payload.relaiId, jointures: true };
      const [query1, query2] = yield [
        call(get, '/api/offre_produits', { headers, query }),
        call(get, '/api/fournisseurs', { headers, query }),
      ];
      console.log(query1.datas.offre_produits);
      yield put(catalogueUpdated(query1.datas.offre_produits, query2.datas.fournisseurs));
    } catch (e) {
      console.log(e);
    }
  }
}

// All sagas to be loaded
export default [redirectOnCommandeCreated, redirectOnProduitCreated, updateCatalogue];
