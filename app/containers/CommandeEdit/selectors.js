import { createSelector } from 'reselect';

const selectCommandeEditDomain = () => (state) => state.commande;

export const selectCommande = () => createSelector(
  selectCommandeEditDomain(),
  (substate) => substate
);

export default selectCommande;

export {
  selectCommandeEditDomain,
};
