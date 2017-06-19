import { createSelector } from 'reselect';
/**
 * Direct selector to the commande state domain
 */

const selectUtilisateurId = () => (state, props) => props.params.utilisateurId;

export const makeSelectUtilisateurDomain = () => state =>
  state.admin && state.admin.utilisateurs ? state.admin.utilisateurs : null;

export const makeSelectUtilisateurs = () =>
  createSelector(
    makeSelectUtilisateurDomain(),
    utilisateurs => (utilisateurs ? utilisateurs.datas : null)
  );

/* l'utilisateur params userId */
export const makeSelectUtilisateur = () =>
  createSelector(
    makeSelectUtilisateurs(),
    selectUtilisateurId(),
    (utilisateurs, userId) =>
      utilisateurs ? utilisateurs.find(ut => ut.id === userId) : null
  );

export const makeSelectUtilisateurStellarAdresse = () =>
  createSelector(
    makeSelectUtilisateur(),
    utilisateur =>
      utilisateur && utilisateur.stellarKeys
        ? utilisateur.stellarKeys.adresse
        : null
  );
