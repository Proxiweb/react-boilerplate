/*
 *
 * CompteUtilisateur reducer
 *
 */

import {
  loginConst as c,
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
    case c.ASYNC_LOGIN_START:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: true } }));
    case c.ASYNC_LOGIN_ERROR:
      return storeState(sessionStorageKey, update(state, { error: { $set: action.error.message }, loading: { $set: false } }));
    case c.ASYNC_LOGIN_SUCCESS:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: false }, auth: { $set: action.datas.user }, token: { $set: action.datas.token } }));
    case LOGOUT:
      return storeState(sessionStorageKey, { ...initialState });
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
