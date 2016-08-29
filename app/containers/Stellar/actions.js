import {
  LOAD_ACCOUNT,
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
  LOAD_PAYMENTS_SUCCESS,
  TRUST,
  TRUST_SUCCESS,
  TRUST_ERROR,
  PAY,
  PAY_SUCCESS,
  PAY_ERROR,
  FEDERATION,
  FEDERATION_SUCCESS,
  FEDERATION_ERROR,
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

export const trust = (currencyCode, maxTrust, issuer, stellarKeys) => ({
  type: TRUST,
  payload: { currencyCode, maxTrust, issuer, stellarKeys },
});

export const trustError = (err) => ({
  type: TRUST_ERROR,
  payload: {
    err,
  },
});

export const trusted = (res) => ({
  type: TRUST_SUCCESS,
  payload: { res },
});


export const pay = (destination, currency, currencyIssuer, amount, stellarKeys) => ({
  type: PAY,
  payload: { destination, currency, currencyIssuer, amount, stellarKeys },
});

export const payError = (err) => ({
  type: PAY_ERROR,
  payload: {
    err,
  },
});

export const paid = (res) => ({
  type: PAY_SUCCESS,
  payload: { res },
});

export const fedLookup = (fedId) => ({
  type: FEDERATION,
  payload: { fedId },
});

export const fedLookupSuccess = (accountId, fedId) => ({
  type: FEDERATION_SUCCESS,
  payload: { accountId, fedId },
});

export const fedLookupError = (err) => ({
  type: FEDERATION_ERROR,
  payload: { err },
});
