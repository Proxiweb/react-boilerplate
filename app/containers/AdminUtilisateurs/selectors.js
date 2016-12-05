// import { createSelector } from 'reselect';/
/**
 * Direct selector to the commande state domain
 */
export const selectUtilisateurDomain = () => (state) => (
  state.admin && state.admin.utilisateurs ? state.admin.utilisateurs : null
);
