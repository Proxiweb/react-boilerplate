/*
 *
 * CommandeEdit reducer
 *
 */
import update from 'react-addons-update';
import assign from 'lodash.assign';
import findIndex from 'lodash.findindex';
import c from './constants';


const commandeVide = {
  id: undefined,
  commandeId: null,
  dateLivraison: null,
  datePaiement: null,
  livraisonId: null,
  plageHoraire: null,
  modifiee: false,
  montant: 0,
  prestationRelai: null,
  recolteFond: 0,
  utilisateurId: null,
  contenus: [],
};

const initialState = {
};

const initCommande = (state, commandeId) => update(state, { [commandeId]: { $set: commandeVide } });

const ajouter = (state, commandeId, offre) => {
  const idx = findIndex(state[commandeId].contenus, { offreId: offre.offreId });
  const changed = typeof state[commandeId].id !== 'undefined';

  if (idx === -1) {
    return update(state, { [commandeId]: { contenus: { $push: [offre] }, modifiee: { $set: changed } } });
  }

  const nQte = state.contenus[idx].quantite + 1;
  return update(state, { [commandeId]: { contenus: { [idx]: { quantite: { $set: nQte } } }, modifiee: { $set: changed } } });
};

const supprimer = (state, commandeId, offreId) => {
  const newContenus = state[commandeId].contenus.filter((cont) => cont.offreId !== offreId);
  const changed = typeof state[commandeId].id !== 'undefined';
  return update(state, { [commandeId]: { contenus: { $set: newContenus }, modifiee: { $set: changed } } });
};

// @TODO dryer avec ajouter
const augmenter = (state, commandeId, offreId) => {
  const idx = findIndex(state[commandeId].contenus, { offreId });
  const nQte = state[commandeId].contenus[idx].quantite + 1;
  const changed = typeof state[commandeId].id !== 'undefined';
  return update(state, { [commandeId]: { contenus: { [idx]: { quantite: { $set: nQte } } }, modifiee: { $set: changed } } });
};

// @TODO dryer avec ajouter
const diminuer = (state, commandeId, offreId) => {
  const idx = findIndex(state[commandeId].contenus, { offreId });
  const nQte = state[commandeId].contenus[idx].quantite - 1;
  if (nQte === 0) return supprimer(state, commandeId, offreId);
  const changed = typeof state[commandeId].id !== 'undefined';
  return update(state, { [commandeId]: { contenus: { [idx]: { quantite: { $set: nQte } } }, modifiee: { $set: changed } } });
};

const majTarifs = (state, payload) => {
  const { totalCommande, partDistribution, commandeId } = payload;
  return update(state, { [commandeId]: { montant: { $set: totalCommande }, recolteFond: { $set: partDistribution } } });
};

const commandeEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.INIT_COMMANDE:
      return initCommande(state, action.payload.commandeId);
    case c.AJOUTER_OFFRE:
      return ajouter(state, action.payload.commandeId, action.payload.offre);

    case c.SUPPRIMER_OFFRE:
      return supprimer(state, action.payload.commandeId, action.payload.offreId);

    case c.DIMINUER_OFFRE:
      return diminuer(state, action.payload.commandeId, action.payload.offreId);

    case c.AUGMENTER_OFFRE:
      return augmenter(state, action.payload.commandeId, action.payload.offreId);

    case c.ASYNC_SAUVEGARDER_SUCCESS:
      return update(state, { [action.datas.commandeId]: { $set: assign(action.datas, { modifiee: false }) } });

    case c.ASYNC_ANNULER_SUCCESS:
      return update(state, { [action.req.commandeId]: { $set: commandeVide } });

    case c.LOAD_COMMANDE:
      return update(state, { [action.payload.datas.commandeId]: { $set: assign(action.payload.datas, { modifiee: false }) } });

    case c.SET_DISTRIBUTION: {
      const { plageHoraire, livraisonId, commandeId } = action.payload;
      return update(state, { [commandeId]: { plageHoraire: { $set: plageHoraire }, livraisonId: { $set: livraisonId } } });
    }

    case c.MODIFIE_TOTAUX:
      return majTarifs(state, action.payload);
    default:
      return state;
  }
};

export default commandeEditReducer;
