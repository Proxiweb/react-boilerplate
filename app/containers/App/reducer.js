/*
 *
 * App reducer
 *
 */
import update from 'immutability-helper';
import uuid from 'node-uuid';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  GLOBAL_PENDING_START,
  GLOBAL_PENDING_STOP,
  SELECTIONNER_RELAIS,
  SET_STELLAR_KEYS,
  messagesConst as c,
  messageSaveConst as cS,
} from './constants';

import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  messages: [],
  pending: true,
  utilisateur_messages: {
    loaded: false,
    datas: [],
  },
  relaiId: null,
  stellarKeys: null,
  nombre_clients: 0,
};

const updateMessage = (state, message) => {
  const autreMessages = state.utilisateur_messages.datas.find(id => id === message.id) || [];
  return update(state, {
    utilisateur_messages: {
      datas: { $set: autreMessages.concat(message) },
    },
  });
};

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return update(state, { messages: { $push: [{ ...action.payload.message, id: uuid.v4() }] } });
    case REMOVE_MESSAGE:
      return update(state, {
        messages: { $set: state.messages.filter(not => not.id !== action.payload.id) },
      });
    case c.ASYNC_LOAD_MESSAGES_SUCCESS:
      return update(state, {
        utilisateur_messages: { datas: { $set: action.datas.messages } },
        loaded: { $set: true },
      });
    case cS.ASYNC_SAVE_MESSAGE_SUCCESS:
      return updateMessage(state, action.datas);
    case GLOBAL_PENDING_START:
      return { ...state, pending: true };
    case GLOBAL_PENDING_STOP:
      return { ...state, pending: false };
    case LOCATION_CHANGE:
      return { ...state, pending: false };
    case SELECTIONNER_RELAIS:
      return { ...state, relaiId: action.payload.relaiId };
    case SET_STELLAR_KEYS:
      return { ...state, stellarKeys: action.payload.stellarKeys };
    case 'WS/NOMBRE_CLIENTS':
      return { ...state, nombre_clients: action.datas.nombre_clients };
    case REHYDRATE: {
      const incoming = action.payload.global;
      if (!incoming) return state;
      const stellarKeys = incoming.stellarKeys;
      return {
        ...state,
        relaiId: incoming.relaiId,
        stellarKeys,
      };
    }
    default:
      return state;
  }
}

export default notificationsReducer;
