/*
 *
 * Commande actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const loadCommandes = (query) => ({
  type: findActionType('load_commandes', c, 'START'),
  url: 'commandes',
  query,
  msgPending: 'Chargement commandes',
});

export const loadUserCommandes = (userId) => ({
  type: findActionType('load_user_commandes', c, 'START'),
  url: `/utilisateurs/${userId}/commandes`,
  msgPending: 'Chargement commandes',
});

export const ajouter = (contenuId, qte) => ({
  type: c.AJOUTER,
  contenuId,
  quantite: qte,
});
