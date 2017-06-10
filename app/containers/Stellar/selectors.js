import { createSelector } from 'reselect';

const selectStellarDomain = () => state => state.stellar;

export const selectEnv = () => createSelector(selectStellarDomain(), state => state.env);

export const selectContacts = () => createSelector(selectStellarDomain(), state => state.contacts);

export default selectStellarDomain;
