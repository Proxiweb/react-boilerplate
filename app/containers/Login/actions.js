/*
 *
 * CompteUtilisateur actions
 *
 */

import {
 LOGIN_START,
 LOGIN_ERROR,
 LOGIN_SUCCESS,
 GOOGLE_LOGIN_START,
 LOAD_DATAS,
 LOGOUT,
} from './constants';

export function login(username, password, redirectPathname = null) {
  return {
    type: LOGIN_START,
    username,
    password,
    redirectPathname,
  };
}

export function googleLogin(googleLoginResponse, redirectPathname = null) {
  return {
    type: GOOGLE_LOGIN_START,
    datas: googleLoginResponse,
    redirectPathname,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function loginSuccess(cnx, redirectPathname = null) {
  return {
    type: LOGIN_SUCCESS,
    user: cnx.user,
    token: cnx.token,
    redirectPathname,
  };
}

export function loginError(message) {
  return {
    type: LOGIN_ERROR,
    error: message,
  };
}

export function loadDatas(datas) {
  return {
    type: LOAD_DATAS,
    datas,
  };
}
