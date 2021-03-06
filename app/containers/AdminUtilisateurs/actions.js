import c from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadUtilisateurs = (query = {}) => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  url: 'utilisateurs',
  query,
});

export const fetchUtilisateurs = ids => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  method: 'post',
  url: 'utilisateurs/byIds',
  datas: { ids },
});
