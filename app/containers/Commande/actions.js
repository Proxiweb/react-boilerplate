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
  msgSuccess: 'Commandes chargées',
});

export const loadCommande = (id) => ({
  type: findActionType('load_commande', c, 'START'),
  url: `commandes/${id}`,
  msgPending: 'Chargement commande',
  msgSuccess: 'Commande chargées',
});

export const ajouter = (contenuId, qte) => ({
  type: c.AJOUTER,
  contenuId,
  quantite: qte,
});
