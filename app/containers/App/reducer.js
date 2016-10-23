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
} from './constants';

const initialState = {
  messages: [],
};


function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return update(state, { messages: { $push: [{ ...action.payload.message, id: uuid.v4() }] } });
    case REMOVE_MESSAGE: {
      return update(state, { messages: { $set: state.messages.filter((not) => not.id !== action.payload.id) } });
    }
    default:
      return state;
  }
}

export default notificationsReducer;
