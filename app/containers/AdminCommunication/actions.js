import c, { SET_MESSAGE } from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadCommunications = (query = {}) => ({
  type: findActionType('load_communications', c, 'START'),
  url: 'communications',
  query,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  message,
});
