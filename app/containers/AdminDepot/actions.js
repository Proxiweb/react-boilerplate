import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadDepots = (query = {}) => ({
  type: findActionType('load_depots', c, 'START'),
  url: 'depots',
  query,
});

export const loadDepotsRelais = (relaiId) => ({
  type: findActionType('load_depots_relais', c, 'START'),
  url: `relais/${relaiId}/depots`,
});

export const ajouterDepot = (depot) => ({
  type: findActionType('ajouter_depot', c, 'START'),
  url: 'depots',
  method: 'post',
  datas: { ...depot },
  msgSuccess: 'Dépot ajouté',
});
