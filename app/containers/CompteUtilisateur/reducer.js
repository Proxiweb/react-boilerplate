/*
 *
 * CompteUtilisateur reducer
 *
 */

import {
  LOGIN_START,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
} from 'containers/Login/constants';

import update from 'react-addons-update';
import { getStateFromStorage, storeState } from 'utils/sessionStorageManager';

const initialState = {
  auth: false,
  loading: false,
  error: false,
  token: null,
};

const sessionStorageKey = 'user';

function compteUtilisateurReducer(state = getStateFromStorage(sessionStorageKey, initialState), action) {
  switch (action.type) {
    case LOGIN_START:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: true } }));
    case LOGIN_ERROR:
      return storeState(sessionStorageKey, update(state, { error: { $set: action.error.message }, loading: { $set: false } }));
    case LOGOUT:
      return storeState(sessionStorageKey, { ...initialState });
    case LOGIN_SUCCESS:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: false }, auth: { $set: action.user }, token: { $set: action.token } }));
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
