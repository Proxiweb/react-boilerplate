/*
 *
 * CommandeEdit reducer
 *
 */

import {
  DEFAULT_ACTION,
} from './constants';

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
};

function commandeEditReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default commandeEditReducer;
