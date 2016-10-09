import { put, select, take } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import c from './constants';
import { selectCommande } from './selectors';
import { selectOffres } from '../Commande/selectors';
import { sauvegarder, modifieTotaux } from './actions';
import round from 'lodash.round';

// Individual exports for testing
export function* sauvegarderSaga() {
  const commande = yield select(selectCommande());
  yield put(sauvegarder(commande));
}

export function* setDistibutionSaga() {
  while(1) { // eslint-disable-line
    yield* takeLatest(c.CHANGE_DISTRIBUTION, sauvegarderSaga);
  }
}

export function* calculeTotaux() {
  while(1) { // eslint-disable-line
    yield* take([c.AJOUTER_OFFRE, c.SUPPRIMER_OFFRE]);
    const commande = yield* select(selectCommande);
    const offres = yield* select(selectOffres);

    const totalCommande = commande.contenus.reduce(
      (memo, contenu) => memo + ((offres[contenu.offreId].prix + offres[contenu.offreId].recolteFond) * (contenu.quantite + contenu.qteRegul)),
      0
    ) / 100;

    const partDistribution = round(
      commande.contenus.reduce(
        (memo, achat) => memo + (achat.offre.recolteFond * (achat.quantite + achat.qteRegul)),
        0
      ) / 100,
    2);

    yield put(modifieTotaux({ totalCommande, partDistribution }));
  }
}

// All sagas to be loaded
export default [
  setDistibutionSaga,
];
