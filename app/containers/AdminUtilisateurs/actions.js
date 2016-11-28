import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadUtilisateurs = (query = {}) => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  url: 'utilisateurs',
  query,
});
