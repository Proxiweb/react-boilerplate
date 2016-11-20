/*
 *
 * App reducer
 *
 */
import update from 'react-addons-update';
import uuid from 'node-uuid';

import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  GLOBAL_PENDING_START,
  GLOBAL_PENDING_STOP,
} from './constants';

const initialState = {
  messages: [],
  pending: false,
};


function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return update(state, { messages: { $push: [{ ...action.payload.message, id: uuid.v4() }] } });
    case REMOVE_MESSAGE: {
      return update(state, { messages: { $set: state.messages.filter((not) => not.id !== action.payload.id) } });
    }
    case GLOBAL_PENDING_START:
      return { ...state, pending: true };
    case GLOBAL_PENDING_STOP:
      return { ...state, pending: false };
    default:
      return state;
  }
}

export default notificationsReducer;
