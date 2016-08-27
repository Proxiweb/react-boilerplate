/*
 *
 * Commande actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const loadCommandes = (page) => ({
  type: findActionType('load_commandes', c, 'START'),
  url: `commandes/${page}`,
  msgPending: 'Chargement commandes',
  msgSuccess: 'Commandes chargées',
});
