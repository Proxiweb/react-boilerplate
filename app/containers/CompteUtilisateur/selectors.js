import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
const selectCompteUtilisateurDomain = () => (state) => state.compteUtilisateur;
/**
 * Other specific selectors
 */


/**
 * Default selector used by CompteUtilisateur
 */

export const selectCompteUtilisateur = () => createSelector(
  [selectCompteUtilisateurDomain()],
  (substate) => substate.auth
);

export const selectPayments = () => createSelector(
  selectCompteUtilisateurDomain(),
  (substate) => substate.payments.datas
);

export const selectPaymentsPagingToken = () => createSelector(
  selectCompteUtilisateurDomain(),
  (substate) => substate.payments.pagingToken
);

export const selectUtilisateurId = () => createSelector(
  [selectCompteUtilisateur()],
  (auth) => (auth ? auth.id : undefined)
);

export const selectBalance = () => createSelector(
  selectCompteUtilisateurDomain(),
  (substate) => substate.balances[0],
);

export const selectLoading = () => createSelector(
  [selectCompteUtilisateurDomain()],
  (substate) => substate.loading
);
