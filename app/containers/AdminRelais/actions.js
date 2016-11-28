import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadRelais = (query = {}) => ({
  type: findActionType('load_relais', c, 'START'),
  url: 'relais',
  query,
});
