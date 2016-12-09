import { createSelector } from 'reselect';
/**
 * Direct selector to the commande state domain
 */
export const selectDepotsDomain = () => (state) => (
  state.admin && state.admin.depots ? state.admin.depots : null
);

export const selectDepots = () => createSelector(
  selectDepotsDomain(),
  (depots) => (depots ? depots.datas : null),
);

export const selectTotal = () => createSelector(
  selectDepotsDomain(),
  (depots) => (depots ? depots.total : null),
);
