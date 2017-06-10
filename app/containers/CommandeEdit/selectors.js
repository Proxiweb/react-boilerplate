import { createSelector } from "reselect";

const selectCommandeEditDomain = () => state => state.commande;
const selectCommandeId = () => (state, props) => props.params.commandeId;

export const selectCommande = () =>
  createSelector(
    selectCommandeEditDomain(),
    selectCommandeId(),
    (substate, commandeId) => substate[commandeId]
  );

const isCotisationInCommande = () =>
  createSelector(
    selectCommande(),
    commande =>
      typeof commande.contenus.find(c => c.offreId === "8b330a52-a605-4a67-aee7-3cb3c9274733") !== "undefined"
  );

export default selectCommande;

export { selectCommandeEditDomain, isCotisationInCommande };
