import { findActionType } from 'utils/asyncSagaConstants';
/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

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
