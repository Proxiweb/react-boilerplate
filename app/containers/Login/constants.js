/*
 *
 * Login constants
 *
 */
import generateConstants from "../../utils/asyncSagaConstants";

export const loginConst = generateConstants("app/Login", "LOGIN");
export const registerConst = generateConstants("app/Login", "REGISTER");
export const mdpConst = generateConstants("app/Login", "MOTDEPASSE");

export const LOGOUT = "app/Login/LOGOUT";
export const SET_ERR_MSG = "app/Login/SET_ERR_MSG";
export const ADD_EFFECT = "app/Login/ADD_EFFECT";
