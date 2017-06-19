import { createSelector } from 'reselect';

const selectCommandeEditDomain = () => state => state.get('commande');
const selectCommandeId = () => (state, props) => props.params.commandeId;

export const makeSelectCommande = () =>
  createSelector(
    selectCommandeEditDomain(),
    selectCommandeId(),
    (substate, commandeId) => substate.get(commandeId)
  );

const isCotisationInCommande = () =>
  createSelector(
    makeSelectCommande(),
    commande =>
      typeof commande
        .get('contenus')
        .find(
          c => c.get('offreId') === '8b330a52-a605-4a67-aee7-3cb3c9274733'
        ) !== 'undefined'
  );

export default makeSelectCommande;

export { selectCommandeEditDomain, isCotisationInCommande };
