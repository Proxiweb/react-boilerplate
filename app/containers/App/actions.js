/*
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 */

import {
 ADD_MESSAGE,
 REMOVE_MESSAGE,
 GLOBAL_PENDING_START,
 GLOBAL_PENDING_STOP,
} from './constants';

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    payload: { message },
  };
}

export function removeMessage(id) {
  return {
    type: REMOVE_MESSAGE,
    payload: { id },
  };
}

export const startGlobalPending = () => ({ type: GLOBAL_PENDING_START });
export const stopGlobalPending = () => ({ type: GLOBAL_PENDING_STOP });
