/*
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 */

import { findActionType } from 'utils/asyncSagaConstants';
import uuid from 'node-uuid';

import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  GLOBAL_PENDING_START,
  GLOBAL_PENDING_STOP,
  SELECTIONNER_RELAIS,
  SET_STELLAR_KEYS,
  messagesConst as c,
  messageSaveConst as cS,
} from './constants';

export function addMessage(message, id) {
  const idt = id || uuid.v4();
  return {
    type: ADD_MESSAGE,
    payload: { message, id: idt },
  };
}

export function removeMessage(id) {
  return {
    type: REMOVE_MESSAGE,
    payload: { id },
  };
}

export const loadMessages = query => ({
  type: findActionType('load_messages', c, 'START'),
  url: 'utilisateur_messages',
  query,
});

export const marquerCommeLu = id => ({
  type: findActionType('save_message', cS, 'START'),
  url: `utilisateur_messages/${id}/lu`,
  method: 'put',
});

export const saveMessage = (message, redirectSuccess) => ({
  type: findActionType('save_message', cS, 'START'),
  url: 'utilisateur_messages',
  datas: { ...message },
  method: 'post',
  msgSuccess: 'Message envoyé !',
  redirectSuccess,
});

export const selectionneRelais = relaiId => ({
  type: SELECTIONNER_RELAIS,
  payload: { relaiId },
});

export const setStellarKeys = stellarKeys => ({
  type: SET_STELLAR_KEYS,
  payload: { stellarKeys },
});

export const startGlobalPending = () => ({ type: GLOBAL_PENDING_START });
export const stopGlobalPending = () => ({ type: GLOBAL_PENDING_STOP });
