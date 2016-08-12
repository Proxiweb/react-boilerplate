/*
 *
 * Login constants
 *
 */
import generateConstants from 'utils/asyncSagaConstants';

export const loginConst = generateConstants('app/Login', 'LOGIN');
export const GOOGLE_LOGIN_START = 'app/Login/GOOGLE_LOGIN_START';
export const LOGOUT = 'app/Login/LOGOUT';
