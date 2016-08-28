import {
  LOAD_ACCOUNT,
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
  LOAD_PAYMENTS_SUCCESS,
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

export const paymentsLoaded = (payments) => ({
  type: LOAD_PAYMENTS_SUCCESS,
  payload: {
    payments,
  },
});
