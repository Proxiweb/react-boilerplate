/*
 *
 * CommandeEdit actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const initCommande = (commandeId) => ({
  type: c.INIT_COMMANDE,
  payload: { commandeId },
});

export const sauvegarder = (datas) => ({
  type: findActionType('sauvegarder', c, 'START'),
  url: datas.id ? `commande_utilisateurs/${datas.id}` : 'commande_utilisateurs',
  method: datas.id ? 'put' : 'post',
  msgPending: 'Sauvegarde commande',
  msgSuccess: 'Commande sauvegardée',
  datas: { ...datas, modifiee: false },
});

export const annuler = (id, commandeId) => ({
  type: findActionType('annuler', c, 'START'),
  url: `commande_utilisateurs/${id}`,
  method: 'del',
  msgPending: 'Annulation commande',
  commandeId,
});

export function ajouter(commandeId, offre) {
  return {
    type: c.AJOUTER_OFFRE,
    payload: { commandeId, offre },
  };
}

export function augmenter(commandeId, offreId) {
  return {
    type: c.AUGMENTER_OFFRE,
    payload: { commandeId, offreId },
  };
}

export function diminuer(commandeId, offreId) {
  return {
    type: c.DIMINUER_OFFRE,
    payload: { commandeId, offreId },
  };
}


export function supprimer(commandeId, offreId) {
  return {
    type: c.SUPPRIMER_OFFRE,
    payload: { commandeId, offreId },
  };
}

export function load(datas) {
  return {
    type: c.LOAD_COMMANDE,
    payload: { datas },
  };
}

export function setDistibution(commandeId, plageHoraire, livraisonId) {
  return {
    type: c.SET_DISTRIBUTION,
    payload: { plageHoraire, livraisonId, commandeId },
  };
}

export function modifieTotaux(commandeId, totalCommande, partDistribution) {
  return {
    type: c.MODIFIE_TOTAUX,
    payload: { commandeId, totalCommande, partDistribution },
  };
}
