import { put, select, take } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import c from './constants';
import { selectCommandeEditDomain } from './selectors';
import { selectOffres } from '../Commande/selectors';
import { sauvegarder, modifieTotaux } from './actions';
import round from 'lodash.round';
import assign from 'lodash/assign';

// Individual exports for testing
export function* sauvegarderSaga() {
  const commande = yield select(selectCommandeEditDomain());
  yield put(sauvegarder(commande));
}

export function* setDistibutionSaga() {
  while(1) { // eslint-disable-line
    yield takeLatest(c.CHANGE_DISTRIBUTION, sauvegarderSaga);
  }
}

export function* calculeTotaux() {
  while(1) { // eslint-disable-line
    const action = yield take([c.AJOUTER_OFFRE, c.SUPPRIMER_OFFRE, c.AUGMENTER_OFFRE, c.DIMINUER_OFFRE]);
    const { commandeId } = action.payload;
    const commande = yield select(selectCommandeEditDomain());
    const offres = yield select(selectOffres());
    const contenus = commande[commandeId].contenus.map((cont) => assign(
      offres[cont.offreId], { quantite: cont.quantite, qteRegul: cont.qteRegul })
    );

    const totalCommande = contenus.reduce(
      (memo, contenu) => memo + ((contenu.prix + contenu.recolteFond) * (contenu.quantite + (contenu.qteRegul || 0))),
      0
    ) / 100;

    const partDistribution = round(
      contenus.reduce(
        (memo, contenu) => memo + (contenu.recolteFond * (contenu.quantite + (contenu.qteRegul || 0))),
        0
      ) / 100,
      2);
    yield put(modifieTotaux(commandeId, totalCommande, partDistribution));
  }
}

// All sagas to be loaded
export default [
  setDistibutionSaga,
  calculeTotaux,
];
