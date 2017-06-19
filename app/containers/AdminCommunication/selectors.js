import { createSelector } from 'reselect';

/**
 * Direct selector to the compteUtilisateur state domain
 */
export const makeSelectCommunicationDomain = () => state =>
  state.admin.communication;

export const makeSelectCommunications = () =>
  createSelector(makeSelectCommunicationDomain(), domain => domain.datas);
