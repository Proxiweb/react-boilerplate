import {
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
  LOAD_ACCOUNT,
  LOAD_PAYMENTS,
  LOAD_PAYMENTS_SUCCESS,
  PAY,
  TRUST,
} from './constants';

const initialState = {
  stellarKeys: {
    accountId: 'GCRN5SVVM72CYTBS3RM4GNDYBJFXR23DW6MRJZKDUQFAFIWNSGJDCAOV',
    secret: 'SAEWX3BJ2SXHWPULBS7SZJ7R5KJ6WDNPORQP5256KA7XD36LOCPRJ2ZD',
    balances: null,
    sequence: null,
    payments: null,
    trustLines: null,
    pending: false,
    error: null,
  },
  contacts: [
    {
      nom: 'Anchor',
      accountId: 'GCSKO7QZZW6HNQ45J624XLRFUIB6HQYD4ZIFVFWSJUR5VAFBZP7FC7JI', // SA4JGSESB3WXT2XCAWUORNXYZVHE6IQCLWGJBUMVHDWGFPM47556BJCV
      currencies: ['PROXI'],
    },
  ],
};


const stellarReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PAYMENTS:
    case TRUST:
    case PAY:
    case LOAD_ACCOUNT:
      return { ...state, pending: true };
    case LOAD_ACCOUNT_SUCCESS: {
      const { balances, sequence } = action.payload.account;
      return { ...state, balances, sequence, pending: false };
    }
    case LOAD_PAYMENTS_SUCCESS: {
      const { payments } = action.payload;
      return { ...state, payments, pending: false };
    }
    case LOAD_ACCOUNT_ERROR:
      return { ...state, error: action.payload.err, pending: false };
    default:
      return state;
  }
};

export default stellarReducer;
