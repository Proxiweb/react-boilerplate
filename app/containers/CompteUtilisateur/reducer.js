/*
 *
 * CompteUtilisateur reducer
 *
 */

import round from 'lodash.round';

import {
  loginConst as c,
  LOGOUT,
  SET_ERR_MSG,
  ADD_EFFECT,
} from 'containers/Login/constants';

import {
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
} from './constants';

import update from 'react-addons-update';
import { getStateFromStorage, storeState } from 'utils/sessionStorageManager';

const initialState = {
  auth: false,
  loading: false,
  error: false,
  token: null,
  paging_token: null,
  payments: {
    datas: [],
    paging_token: null,
  },
  balances: [],
};


const sessionStorageKey = 'user';

const majComptes = (state, datas) => {
  const { op, trx, id, paging_token } = datas;
  if (op.type !== 'payment' || op.asset_type === 'native') return state;
  const type = op.source_account === state.auth.stellarKeys.adresse ? 'debit' : 'credit';
  const payment = {
    id,
    type,
    montant: round(parseFloat(op.amount), 2),
    date: trx.created_at,
    memo: trx.memo_type === 'text' ? trx.memo : null,
  };

  // memo greatest paging_token
  const currentPaginToken = state.payments.pagingToken || paging_token; // eslint-disable-line
  const pagingToken =  currentPaginToken && currentPaginToken < paging_token ? // eslint-disable-line
                          paging_token : // eslint-disable-line
                          currentPaginToken;

  return update(state, { payments: { datas: { $push: [payment] }, pagingToken: { $set: pagingToken } } });
};

function compteUtilisateurReducer(state = getStateFromStorage(sessionStorageKey, initialState, { error: false, loading: false }), action) {
  switch (action.type) {
    case c.ASYNC_LOGIN_START:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: true } }));
    case c.ASYNC_LOGIN_ERROR:
      return storeState(sessionStorageKey, update(state, { error: { $set: action.msgError }, loading: { $set: false } }));
    case c.ASYNC_LOGIN_SUCCESS:
      return storeState(sessionStorageKey, update(state, { error: { $set: false }, loading: { $set: false }, auth: { $set: action.datas.user }, token: { $set: action.datas.token } }));
    case LOGOUT:
      return storeState(sessionStorageKey, { ...initialState });
    case SET_ERR_MSG:
      return storeState(sessionStorageKey, update(state, { error: { $set: action.message } }));
    case ADD_EFFECT:
      return majComptes(state, action.payload);
    case LOAD_ACCOUNT_SUCCESS: {
      const { balances, sequence } = action.payload.account;
      return { ...state, balances, sequence, pending: false };
    }
    case LOAD_ACCOUNT_ERROR:
      return { ...state, error: action.payload.err, pending: false };
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
