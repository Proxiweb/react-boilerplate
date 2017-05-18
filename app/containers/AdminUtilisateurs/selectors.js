import { createSelector } from 'reselect';
/**
 * Direct selector to the commande state domain
 */

const selectUtilisateurId = () => (state, props) => props.params.utilisateurId;

export const selectUtilisateurDomain = () => (state) => (
  state.admin && state.admin.utilisateurs ? state.admin.utilisateurs : null
);

export const selectUtilisateurs = () => createSelector(
  selectUtilisateurDomain(),
  (utilisateurs) => (utilisateurs ? utilisateurs.datas : null),
);

/* l'utilisateur params userId */
export const selectUtilisateur = () => createSelector(
  selectUtilisateurs(),
  selectUtilisateurId(),
  (utilisateurs, userId) => (utilisateurs ? utilisateurs.find((ut) => ut.id === userId) : null)
);


export const selectUtilisateurStellarAdresse = () => createSelector(
  selectUtilisateur(),
  (utilisateur) => (utilisateur && utilisateur.stellarKeys
    ? utilisateur.stellarKeys.adresse
    : null),
);
