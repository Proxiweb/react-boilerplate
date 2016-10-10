import {
  LOAD_ACCOUNT,
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
} from './constants';

export const loadAccount = (accountId) => ({
  type: LOAD_ACCOUNT,
  payload: {
    accountId,
  },
});

export const loadAccountError = (err) => ({
  type: LOAD_ACCOUNT_ERROR,
  payload: {
    err,
  },
});

export const accountLoaded = (account) => ({
  type: LOAD_ACCOUNT_SUCCESS,
  payload: {
    account,
  },
});
