import { createSelector } from 'reselect';

/**
 * Direct selector to the commandeEdit state domain
 */
const selectCommandeEditDomain = () => (state) => state.commande;

/**
 * Other specific selectors
 */


/**
 * Default selector used by CommandeEdit
 */

export const selectCommande = () => createSelector(
  selectCommandeEditDomain(),
  (substate) => substate
);

export default selectCommande;
export {
  selectCommandeEditDomain,
};
