/*
 *
 * CompteUtilisateur actions
 *
 */

import {
  loginConst as lc,
  registerConst as rc,
  mdpConst as mc,
  LOGOUT,
  SET_ERR_MSG,
  ADD_EFFECT,
} from './constants';

export function login({ username, password, redirectPathname = null }) {
  return {
    type: lc.ASYNC_LOGIN_START,
    url: 'login',
    method: 'post',
    datas: { username, password },
    redirectPathname,
  };
}

export function register({ username, password, passwordConfirm, redirectPathname = null }) {
  return {
    type: rc.ASYNC_REGISTER_START,
    url: 'register',
    method: 'post',
    datas: { username, password, passwordConfirm },
    redirectPathname,
  };
}

export function motdepasse({ username, redirectPathname = null }) {
  return {
    type: mc.ASYNC_MOTDEPASSE_START,
    url: 'motdepasse',
    method: 'post',
    datas: { username },
    redirectPathname,
  };
}

// export function googleLogin(googleLoginResponse, redirectPathname = null) {
//   return {
//     type: GOOGLE_LOGIN_START,
//     datas: googleLoginResponse,
//     redirectPathname,
//   };
// }

export function logout(redirectPathname = null) {
  return {
    type: LOGOUT,
    redirectPathname,
  };
}

export function setAuthErrorMsg(message) {
  return {
    type: SET_ERR_MSG,
    message,
  };
}

export function addEffect(effect) {
  return {
    type: ADD_EFFECT,
    payload: { ...effect },
  };
}

//
// export function loginSuccess(cnx, redirectPathname = null) {
//   return {
//     type: LOGIN_SUCCESS,
//     user: cnx.user,
//     token: cnx.token,
//     redirectPathname,
//   };
// }
//
// export function loginError(message) {
//   return {
//     type: LOGIN_ERROR,
//     error: message,
//   };
// }
