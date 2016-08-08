import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
const selectCompteUtilisateurDomain = state => state.compteUtilisateur;
const selectCommandeDomain = state => state.compteUtilisateur.auth.commandes;
const selectCommandeIdParam = (state, props) => props.params.commandeId;

/**
 * Other specific selectors
 */


/**
 * Default selector used by CompteUtilisateur
 */

const selectCompteUtilisateur = createSelector(
  selectCompteUtilisateurDomain,
  (substate) => substate
);

export const extractEmail = createSelector(
  selectCompteUtilisateur,
  (compteUtilisateur) => ({ email: compteUtilisateur.auth.email })
);

export const extractAddress = createSelector(
  selectCompteUtilisateur,
  (compteUtilisateur) => {
    if (!compteUtilisateur.auth || !compteUtilisateur.auth.commandes || compteUtilisateur.auth.commandes.length === 0) return null;
    const adr = {};
    Object.keys(compteUtilisateur.auth.commandes[0].adresseFacturation).forEach(key => {
      adr[`${key}F`] = compteUtilisateur.auth.commandes[0].adresseFacturation[key];
    });

    const uneAdresseLivraison = compteUtilisateur.auth.commandes.find(commande => commande.adresseLivraison);

    if (uneAdresseLivraison && uneAdresseLivraison.adresseLivraison) {
      Object.keys(uneAdresseLivraison.adresseLivraison).forEach(key => {
        adr[`${key}E`] = uneAdresseLivraison.adresseLivraison[key];
      });

      // on déclenche l'affichage de la zone addresse de facturation
      adr.livraisonDifferente = true;
    }
    return adr;
  }
);

export const extractId = createSelector(
  selectCompteUtilisateur,
  (compteUtilisateur) => ({ id: compteUtilisateur.auth.id })
);

export const selectCommande = createSelector(
  selectCommandeDomain,
  selectCommandeIdParam,
  (commandes, commandeId) => (commandes ? commandes.find(commande => commande.id === commandeId) : null)
);

export default selectCompteUtilisateur;
export {
  selectCompteUtilisateurDomain,
};
