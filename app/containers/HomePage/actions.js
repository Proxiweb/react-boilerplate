import { findActionType } from 'utils/asyncSagaConstants';

import c from './constants';

export function loadDatas1Start(id) {
  return {
    type: findActionType('load_datas_1', c, 'START'),
    url: `loadDatas1/${id}`,
    id,
  };
}

export function loadDatas2Start(id) {
  return {
    type: findActionType('load_datas_2', c, 'START'),
    url: `loadDatas2/${id}`,
    id,
    msgPending: 'Chargement des données 2',
    msgSuccess: 'Données 2 chargées',
    // msgError: 'Message personalisé !', // msg perso override server message
  };
}
