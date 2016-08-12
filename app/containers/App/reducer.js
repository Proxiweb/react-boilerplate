/*
 *
 * App reducer
 *
 */
import update from 'react-addons-update';

import {
  ADD_ERROR,
  CLEAR_SCOPE,
} from './constants';

const initialState = {
  errors: {}
};

function addError(state, scope, msg) {
  const maj = {};
  if (state.errors[scope].length) {
    maj[scope] = { $push: [msg] };
  } else {
    maj[scope] = { $set: [msg] };
  }
  return update(state, maj);
}

function globalReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ERROR:
      return addError(state, action.scope, action.msg);
    case CLEAR_SCOPE: {
      const maj = {};
      maj[scope] = { $set: []};
      return update(state, maj);
    }
    default:
      return state;
  }
}

export default globalReducer;
