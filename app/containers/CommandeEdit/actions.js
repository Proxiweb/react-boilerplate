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

export function ajouter(offre) {
  return {
    type: c.AJOUTER_OFFRE,
    payload: { offre },
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
