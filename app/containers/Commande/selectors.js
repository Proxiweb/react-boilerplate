import { createSelector } from 'reselect';
import intersection from 'lodash.intersection';
/**
 * Direct selector to the commande state domain
 */
const selectCommandeDomain = () => state => state.commandes;

/**
 * Other specific selectors
 */


/**
 * Default selector used by Commande
 */

export const selectCommandes = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.commandes
);

export const selectCommandesUtilisateur = (utilisateurId) => createSelector(
  selectCommandeDomain(),
  (substate) => {
    const entities = substate.datas.entities;
    if (!entities.commandeUtilisateur) return null;

    const commandeUtilisateurs = entities.commandeUtilisateur.filter(cu => cu.utilisateur.id === utilisateurId);
    const commandes = entities.commande.filter(cmde => intersection(cmde.commandeUtilisateurs, commandeUtilisateurs).length !== 0);

    return commandes.map(commande => ({
      ...commande,
      commandeUtilisateurs: commande.commandeUtilisateurs.map(cu => entities.commandeUtilisateur.filter(cut => cut.id === cu.id)),
    }));
  }
);

export const selectAsyncState = () => createSelector(
  selectCommandeDomain(),
  (substate) => ({ pending: substate.pending, error: substate.error })
);

export default selectCommandes;
