/*
 *
 * App actions
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
