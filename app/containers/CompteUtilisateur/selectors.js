import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
const selectCompteUtilisateurDomain = () => state => state.compteUtilisateur;
/**
 * Other specific selectors
 */
export const selectUserId = () => (state, props) => props.params.userId;

/**
 * Default selector used by CompteUtilisateur
 */

export const selectCompteUtilisateur = () =>
  createSelector([selectCompteUtilisateurDomain()], substate => substate.auth);

export const selectToken = () =>
  createSelector([selectCompteUtilisateurDomain()], substate => substate.token);

export const selectPayments = () =>
  createSelector(selectCompteUtilisateurDomain(), substate => substate.payments.datas);

export const selectPaymentsPagingToken = () =>
  createSelector(selectCompteUtilisateurDomain(), substate => substate.payments.pagingToken);

export const selectAuthUtilisateurId = () =>
  createSelector([selectCompteUtilisateur()], auth => auth ? auth.id : undefined);

export const selectRoles = () =>
  createSelector([selectCompteUtilisateur()], auth => auth ? auth.roles : undefined);

export const selectRelaiId = () =>
  createSelector([selectCompteUtilisateur()], auth => auth ? auth.relaiId : undefined);

export const selectAuthApiKey = () =>
  createSelector([selectCompteUtilisateur()], auth => auth ? auth.apiKey : undefined);

export const selectBalance = () =>
  createSelector(selectCompteUtilisateurDomain(), substate =>
    substate.balances.find(bal => bal.asset_code === 'PROXI'));

export const selectMontantBalance = () =>
  createSelector(selectBalance(), balance => balance ? parseFloat(balance.balance) : null);

export const selectMaxBalance = () => createSelector(selectBalance(), balance => parseFloat(balance.limit));

export const selectLoading = () =>
  createSelector([selectCompteUtilisateurDomain()], substate => substate.loading);

export const selectVirements = () =>
  createSelector(
    selectCompteUtilisateurDomain(),
    substate =>
      substate.virements
        ? substate.virements.filter(dep => dep.type === 'virement' && !dep.transfertEffectue)
        : null
  );
