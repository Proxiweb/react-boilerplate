/*
 *
 * App reducer
 *
 */
import update from 'react-addons-update';
import uuid from 'node-uuid';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  GLOBAL_PENDING_START,
  GLOBAL_PENDING_STOP,
  SELECTIONNER_RELAIS,
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
};

const updateMessage = (state, message) => {
  const autreMessages =
    state.utilisateur_messages.datas
    .find((id) => id === message.id) || [];
  return update(
    state,
    {
      utilisateur_messages: {
        datas: { $set: autreMessages.concat(message) },
      },
    }
  );
};


function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return update(state, { messages: { $push: [{ ...action.payload.message, id: uuid.v4() }] } });
    case REMOVE_MESSAGE:
      return update(state, { messages: { $set: state.messages.filter((not) => not.id !== action.payload.id) } });
    case c.ASYNC_LOAD_MESSAGES_SUCCESS:
      return update(state, { utilisateur_messages: { datas: { $set: action.datas.messages } }, loaded: { $set: true } });
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
    case REHYDRATE: {
      const incoming = action.payload.global;
      if (!incoming) return state;
      return { ...state, relaiId: incoming.relaiId };
    }
    default:
      return state;
  }
}

export default notificationsReducer;
