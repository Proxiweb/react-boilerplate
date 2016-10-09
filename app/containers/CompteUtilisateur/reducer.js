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

import update from 'react-addons-update';
import { getStateFromStorage, storeState } from 'utils/sessionStorageManager';

const initialState = {
  auth: false,
  loading: false,
  error: false,
  token: null,
  payments: [],
};


const sessionStorageKey = 'user';

const majComptes = (state, datas) => {
  const { op, trx } = datas;
  if (op.type !== 'payment' || op.asset_type === 'native') return state;
  const type = op.source_account === state.auth.stellarKeys.adresse ? 'debit' : 'credit';
  const payment = {
    type,
    montant: round(parseFloat(op.amount), 2),
    date: trx.created_at,
    memo: trx.memo_type === 'text' ? trx.memo : null,
    paging_token: op.paging_token,
  };

  return update(state, { payments: { $push: [payment] } });
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
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
