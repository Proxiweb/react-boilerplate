import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
const makeSelectCompteUtilisateurDomain = () => state =>
  state.get('compteUtilisateur');
/**
 * Other specific selectors
 */
export const makeSelectUserId = () => (state, props) => props.params.userId;

/**
 * Default selector used by CompteUtilisateur
 */

export const makeSelectCompteUtilisateur = () =>
  createSelector([makeSelectCompteUtilisateurDomain()], substate =>
    substate.get('auth')
  );

export const makeSelectToken = () =>
  createSelector([makeSelectCompteUtilisateurDomain()], substate =>
    substate.get('token')
  );

export const makeSelectPayments = () =>
  createSelector(makeSelectCompteUtilisateurDomain(), substate =>
    substate.getIn(['payments', 'datas'])
  );

export const makeSelectPaymentsPagingToken = () =>
  createSelector(makeSelectCompteUtilisateurDomain(), substate =>
    substate.getIn(['payments', 'pagingToken'])
  );

export const makeSelectAuthUtilisateurId = () =>
  createSelector([makeSelectCompteUtilisateur()], auth => auth.get('id'));

export const makeSelectDatePaiementCotisation = () =>
  createSelector([makeSelectCompteUtilisateur()], auth =>
    auth.get('datePaiementCotisation')
  );

export const makeSelectRoles = () =>
  createSelector([makeSelectCompteUtilisateur()], auth => auth.get('roles'));

export const makeSelectRelaiId = () =>
  createSelector([makeSelectCompteUtilisateur()], auth => auth.get('relaiId'));

export const makeSelectAuthApiKey = () =>
  createSelector([makeSelectCompteUtilisateur()], auth => auth.get('apiKey'));

export const makeSelectBalance = () =>
  createSelector(makeSelectCompteUtilisateurDomain(), substate =>
    substate.get('balances').find(bal => bal.get('asset_code') === 'PROXI')
  );

export const makeSelectMontantBalance = () =>
  createSelector(
    makeSelectBalance(),
    balance => (balance ? parseFloat(balance.get('balance')) : null)
  );

export const makeSelectMaxBalance = () =>
  createSelector(makeSelectBalance(), balance =>
    parseFloat(balance.get('limit'))
  );

export const makeSelectLoading = () =>
  createSelector([makeSelectCompteUtilisateurDomain()], substate =>
    substate.get('loading')
  );

export const makeSelectVirements = () =>
  createSelector(
    makeSelectCompteUtilisateurDomain(),
    substate =>
      substate.get('virements')
        ? substate
            .get('virements')
            .filter(
              dep =>
                dep.get('type') === 'virement' && !dep.get('transfertEffectue')
            )
        : null
  );
