import { createSelector } from 'reselect';

const makeSelectStellarDomain = () => state => state.get('stellar');

export const makeSelectEnv = () =>
  createSelector(makeSelectStellarDomain(), state => state.get('env'));

export const makeSelectContacts = () =>
  createSelector(makeSelectStellarDomain(), state => state.get('contacts'));

export default makeSelectStellarDomain;
