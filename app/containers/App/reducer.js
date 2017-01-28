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
  messagesConst as c,
} from './constants';

const initialState = {
  messages: [],
  pending: true,
  utilisateur_messages: {
    loaded: false,
    datas: [],
  },
};


function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return update(state, { messages: { $push: [{ ...action.payload.message, id: uuid.v4() }] } });
    case REMOVE_MESSAGE:
      return update(state, { messages: { $set: state.messages.filter((not) => not.id !== action.payload.id) } });
    case c.ASYNC_LOAD_MESSAGES_SUCCESS:
      return update(state, { utilisateur_messages: { $set: action.datas } });
    case GLOBAL_PENDING_START:
      return { ...state, pending: true };
    case GLOBAL_PENDING_STOP:
      return { ...state, pending: false };
    case LOCATION_CHANGE:
      return { ...state, pending: false };
    default:
      return state;
  }
}

export default notificationsReducer;
