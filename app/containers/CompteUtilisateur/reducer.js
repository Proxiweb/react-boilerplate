/*
 *
 * CompteUtilisateur reducer
 *
 */

import {
  LOGIN_START,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOAD_DATAS,
  LOGOUT,
} from 'containers/Login/constants';

import update from 'react-addons-update';

const initialState = {
  auth: false,
  loading: false,
  error: false,
};

function compteUtilisateurReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_START:
      return update(state, { error: { $set: false }, loading: { $set: true } });
    case LOGIN_ERROR:
      return update(state, { error: { $set: action.error.message }, loading: { $set: false } });
    case LOGOUT:
      return update(state, { auth: { $set: false } });
    case LOGIN_SUCCESS:
      return update(state, { error: { $set: false }, loading: { $set: false }, auth: { $set: action.user } });
    case LOAD_DATAS:
      return action.datas;
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
