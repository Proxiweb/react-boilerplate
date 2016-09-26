/*
 *
 * CommandeEdit reducer
 *
 */
import update from 'react-addons-update';
import findIndex from 'lodash.findindex';
import {
  AJOUTER,
  SUPPRIMER,
} from './constants';


const ajouter = (state, offre) => {
  const idx = findIndex(state.contenus, { offreId: offre.offreId });

  if (idx === -1) {
    return update(state, { contenus: { $push: [offre] } });
  }

  const nQte = state.contenus[idx].quantite + 1;
  return update(state, { contenus: { [idx]: { quantite: { $set: nQte } } } });
};

const supprimer = (state, offreId) => {
  const newContenus = state.contenus.filter((cont) => cont.offreId !== offreId);
  return update(state, { contenus: { $set: newContenus } });
};

const initialState = {
  commandeId: null,
  dateLivraison: null,
  datePaiement: null,
  livraisonId: null,
  modifiee: false,
  montant: null,
  prestationRelai: null,
  recolteFond: null,
  utilisateurId: null,
  contenus: [],
};

function commandeEditReducer(state = initialState, action) {
  switch (action.type) {
    case AJOUTER:
      return ajouter(state, action.payload.offre);
    case SUPPRIMER:
      return supprimer(state, action.payload.offreId);
    default:
      return state;
  }
}

export default commandeEditReducer;
