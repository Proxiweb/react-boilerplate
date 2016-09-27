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
 ADD_ERROR,
 CLEAR_SCOPE,
} from './constants';

export function addError(scope, msg) {
  return {
    type: ADD_ERROR,
    scope,
    msg,
  };
}

export function clearScope(scope) {
  return {
    type: CLEAR_SCOPE,
    scope,
  };
}
