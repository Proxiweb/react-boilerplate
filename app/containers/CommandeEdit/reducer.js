/*
 *
 * CommandeEdit reducer
 *
 */
import update from 'react-addons-update';
import findIndex from 'lodash.findindex';
import c from './constants';

const ajouter = (state, offre) => {
  const idx = findIndex(state.contenus, { offreId: offre.offreId });

  if (idx === -1) {
    return update(state, { contenus: { $push: [offre] }, modifiee: { $set: true } });
  }

  const nQte = state.contenus[idx].quantite + 1;
  return update(state, { contenus: { [idx]: { quantite: { $set: nQte } } }, modifiee: { $set: true } });
};

const supprimer = (state, offreId) => {
  const newContenus = state.contenus.filter((cont) => cont.offreId !== offreId);
  return update(state, { contenus: { $set: newContenus }, modifiee: { $set: true } });
};

const majTarifs = (state, totaux) => {
  const { totalCommande, partDistribution } = totaux;
  return update(state, { montant: { $set: totalCommande }, recolteFond: { $set: partDistribution } });
};

const initialState = {
  id: undefined,
  commandeId: null,
  dateLivraison: null,
  datePaiement: null,
  livraisonId: null,
  plageHoraire: null,
  modifiee: false,
  montant: null,
  prestationRelai: null,
  recolteFond: null,
  utilisateurId: null,
  contenus: [],
  asyncStatus: {
    pendingMessage: null,
    error: null,
  },
};

function commandeEditReducer(state = initialState, action) {
  switch (action.type) {
    case c.AJOUTER_OFFRE:
      return ajouter(state, action.payload.offre);

    case c.SUPPRIMER_OFFRE:
      return supprimer(state, action.payload.offreId);

    case c.ASYNC_SAUVEGARDER_SUCCESS:
      return { ...state, ...action.datas, modifiee: false };

    case c.ASYNC_ANNULER_SUCCESS:
      return initialState;

    case c.LOAD_COMMANDE:
      return { ...state, ...action.payload.datas };

    case c.SET_DISTRIBUTION: {
      const { plageHoraire, livraisonId } = action.payload;
      return { ...state, plageHoraire, livraisonId };
    }

    case c.MODIFIE_TOTAUX:
      return majTarifs(state, action.payload);
    default:
      return state;
  }
}

export default commandeEditReducer;
