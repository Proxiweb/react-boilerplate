import { take, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import c from 'containers/Commande/constants';

// Individual exports for testing
// export function* redirectOnCommandeCreated() {
//   while (1) {
//     // eslint-disable-line
//     yield take(c.ASYNC_CREATE_COMMANDE_SUCCESS);
//     window.location = '/';
//   }
// }

export function* redirectOnProduitCreated() {
  while (1) {
    // eslint-disable-line
    const action = yield take(c.ASYNC_SAVE_PRODUIT_SUCCESS);
    const { datas: { id, fournisseurId } } = action;
    yield put(push(`fournisseurs/${fournisseurId}/catalogue/${id}`));
  }
}

export function* redirectOnAnnuler() {
  while (1) {
    // eslint-disable-line
    try {
      yield take(c.ASYNC_ANNULER_SUCCESS);
      window.location = '/';
    } catch (e) {
      console.log(e);
    }
  }
}

// All sagas to be loaded
export default [
  // redirectOnCommandeCreated,
  redirectOnProduitCreated,
  redirectOnAnnuler,
];
