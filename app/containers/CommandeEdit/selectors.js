import { createSelector } from 'reselect';

const selectCommandeEditDomain = () => (state) => state.commande;
const selectCommandeId = () => (state, props) => props.params.commandeId;

export const selectCommande = () => createSelector(
  selectCommandeEditDomain(),
  selectCommandeId(),
  (substate, commandeId) => substate[commandeId]
);

export default selectCommande;

export {
  selectCommandeEditDomain,
};
