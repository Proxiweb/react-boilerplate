import { createSelector } from 'reselect';
/**
 * Direct selector to the commande state domain
 */
export const makeSelectDepotsDomain = () => state =>
  state.admin && state.admin.depots ? state.admin.depots : null;

const selectAdminDomain = () => state => state.admin || null;

export const makeSelectDepots = () =>
  createSelector(
    makeSelectDepotsDomain(),
    depots => (depots ? depots.datas : null)
  );

export const makeSelectTotal = () =>
  createSelector(
    makeSelectDepotsDomain(),
    depots => (depots ? depots.total : null)
  );

export const makeSelectRelais = () =>
  createSelector(selectAdminDomain(), admin => admin.relais.datas || null);
