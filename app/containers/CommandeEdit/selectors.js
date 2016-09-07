import { createSelector } from 'reselect';

/**
 * Direct selector to the commandeEdit state domain
 */
const selectCommandeEditDomain = () => state => state.get('commandeEdit');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CommandeEdit
 */

const selectCommandeEdit = () => createSelector(
  selectCommandeEditDomain(),
  (substate) => substate.toJS()
);

export default selectCommandeEdit;
export {
  selectCommandeEditDomain,
};
