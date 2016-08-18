import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
const selectCompteUtilisateurDomain = state => state.compteUtilisateur;

/**
 * Other specific selectors
 */


/**
 * Default selector used by CompteUtilisateur
 */

export const selectCompteUtilisateur = createSelector(
  selectCompteUtilisateurDomain,
  (substate) => substate.auth
);

export const selectProfile = createSelector(
  selectCompteUtilisateur,
  (auth) => ({ nom: auth.nom, prenom: auth.prenom })
);
