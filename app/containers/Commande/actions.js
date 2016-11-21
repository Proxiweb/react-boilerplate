/*
 *
 * Commande actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const loadCommandes = () => ({
  type: findActionType('load_commandes', c, 'START'),
  url: 'commandes',
  msgPending: 'Chargement commandes',
});

export const loadCommande = (id) => ({
  type: findActionType('load_commande', c, 'START'),
  url: `commandes/${id}`,
  msgPending: 'Chargement commande',
});

export const ajouter = (contenuId, qte) => ({
  type: c.AJOUTER,
  contenuId,
  quantite: qte,
});
