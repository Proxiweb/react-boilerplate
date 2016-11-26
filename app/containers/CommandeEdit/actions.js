/*
 *
 * CommandeEdit actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const sauvegarder = (datas) => ({
  type: findActionType('sauvegarder', c, 'START'),
  url: datas.id ? `commande_utilisateurs/${datas.id}` : 'commande_utilisateurs',
  method: datas.id ? 'put' : 'post',
  msgPending: 'Sauvegarde commande',
  msgSuccess: 'Commande sauvegardée',
  datas,
});

export const annuler = (id) => ({
  type: findActionType('annuler', c, 'START'),
  url: `commande_utilisateurs/${id}`,
  method: 'del',
  msgPending: 'Annulation commande',
});

export function ajouter(offre) {
  return {
    type: c.AJOUTER_OFFRE,
    payload: { offre },
  };
}

export function augmenter(offreId) {
  return {
    type: c.AUGMENTER_OFFRE,
    payload: { offreId },
  };
}

export function diminuer(offreId) {
  return {
    type: c.DIMINUER_OFFRE,
    payload: { offreId },
  };
}


export function supprimer(offreId) {
  return {
    type: c.SUPPRIMER_OFFRE,
    payload: { offreId },
  };
}

export function load(datas) {
  return {
    type: c.LOAD_COMMANDE,
    payload: { datas },
  };
}

export function setDistibution(plageHoraire, livraisonId) {
  return {
    type: c.SET_DISTRIBUTION,
    payload: { plageHoraire, livraisonId },
  };
}

export function modifieTotaux(totalCommande, partDistribution) {
  return {
    type: c.MODIFIE_TOTAUX,
    payload: { totalCommande, partDistribution },
  };
}
