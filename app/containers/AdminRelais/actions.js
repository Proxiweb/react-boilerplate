import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadRelais = (query = {}) => ({
  type: findActionType('load_relais', c, 'START'),
  url: 'relais',
  query,
});

export const saveRelais = (relais, msgSuccess = 'Relais modifié') => ({
  type: findActionType('save_relais', c, 'START'),
  url: `relais/${relais.id}`,
  method: (relais.id ? 'put' : 'post'),
  datas: { ...relais },
  msgSuccess,
});
