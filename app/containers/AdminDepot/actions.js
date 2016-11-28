import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadDepots = (query = {}) => ({
  type: findActionType('load_depots', c, 'START'),
  url: 'depots',
  query,
});
