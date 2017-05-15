/*
 *
 * CompteUtilisateur reducer
 *
 */

import round from 'lodash/round';
import omit from 'lodash/omit';

import {
  loginConst as c,
  registerConst as cR,
  LOGOUT,
  SET_ERR_MSG,
  ADD_EFFECT,
} from 'containers/Login/constants';

import {
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
  STORE_STELLAR_KEYS,
  progVirConst,
  loadVirConst,
  supprVirConst,
  refreshConst as ref,
  saveAccountConst as s,
} from './constants';

import update from 'react-addons-update';
import getTime from 'date-fns/get_time';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  auth: false,
  loading: false,
  error: false,
  token: null,
  payments: {
    datas: [],
    pagingToken: null,
  },
  balances: [],
  virements: null,
};

// const sessionStorageKey = 'user';

const majComptes = (state, datas) => {
  const { op, trx } = datas;
  const { id, paging_token, source_account } = op; //  type, asset_type,

  // // si le paiement a déjà été enregistré
  // if (state.payments.datas.find((payment) => payment.id === id)) {
  //   return state;
  // }

  // if (type !== 'payment' || asset_type === 'native') return state; // eslint-disable-line
  const typeOp = source_account === state.auth.stellarKeys.adresse
    ? 'debit'
    : 'credit'; // eslint-disable-line
  const payment = {
    id,
    type: typeOp,
    montant: round(parseFloat(op.amount), 2),
    date: trx.created_at,
    dateUnix: getTime(trx.created_at),
    memo: trx.memo_type === 'text' ? trx.memo : null,
  };

  // memo greatest paging_token
  const currentPaginToken = state.payments.pagingToken || paging_token; // eslint-disable-line
  const pagingToken = currentPaginToken && currentPaginToken < paging_token // eslint-disable-line
    ? paging_token // eslint-disable-line
    : currentPaginToken;

  return update(state, {
    payments: {
      datas: { $set: [payment].concat(state.payments.datas) },
      pagingToken: { $set: pagingToken },
    },
  });
};

function compteUtilisateurReducer(state = initialState, action) {
  switch (action.type) {
    case c.ASYNC_LOGIN_START:
      return update(state, { error: { $set: false }, loading: { $set: true } });
    case c.ASYNC_LOGIN_ERROR:
      return update(state, {
        error: { $set: action.msgError },
        loading: { $set: false },
      });
    case cR.ASYNC_REGISTER_SUCCESS:
    case c.ASYNC_LOGIN_SUCCESS:
      return update(state, {
        error: { $set: false },
        loading: { $set: false },
        auth: {
          $set: omit(action.datas.user, ['commandeContenus', 'commandes']),
        },
        token: { $set: action.datas.token },
      });
    case s.ASYNC_SAVE_ACCOUNT_SUCCESS:
      return update(state, { auth: { $set: action.datas } });
    case progVirConst.ASYNC_PROGRAM_VIREMENT_SUCCESS:
      return update(state, { virements: { $push: [action.datas] } });
    case loadVirConst.ASYNC_LOAD_VIREMENTS_SUCCESS:
      return update(state, { virements: { $set: action.datas.depots } });
    case supprVirConst.ASYNC_ANNULER_VIREMENT_SUCCESS:
      return update(state, {
        virements: { $set: state.virements.filter(v => v.id !== action.req.id) },
      });
    case LOGOUT:
      return { ...initialState };
    case SET_ERR_MSG:
      return update(state, { error: { $set: action.message } });
    case ADD_EFFECT:
      return majComptes(state, action.payload);
    case LOAD_ACCOUNT_SUCCESS: {
      const { balances, sequence } = action.payload.account;
      return { ...state, balances, sequence, pending: false };
    }

    case LOAD_ACCOUNT_ERROR:
      return { ...state, error: action.payload.err, pending: false };
    case REHYDRATE: {
      const incoming = action.payload.compteUtilisateur;
      return { ...state, ...incoming, loading: false };
    }
    case STORE_STELLAR_KEYS: {
      const stellarKeys = action.payload.stellarKeys;
      return update(state, { auth: { $set: { ...state.auth, stellarKeys } } });
    }

    case ref.ASYNC_REFRESH_SUCCESS: {
      return update(state, { token: { $set: action.datas.token } });
    }
    default:
      return state;
  }
}

export default compteUtilisateurReducer;
