/*
 *
 * App reducer
 *
 */
// import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';

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

const initialState = fromJS({
  messages: [],
  pending: true,
  utilisateur_messages: {
    loaded: false,
    datas: [],
  },
  relaiId: null,
  stellarKeys: null,
  nombre_clients: 0,
});

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return state.updateIn(['messages'], arr =>
        arr.push(fromJS({ ...action.payload }))
      );
    case REMOVE_MESSAGE:
      return state.updateIn(['messages'], arr =>
        arr.filter(msg => msg.get('id') !== action.payload.id)
      );
    case c.ASYNC_LOAD_MESSAGES_SUCCESS:
      return state
        .setIn(['utilisateur_messages', 'datas'], action.datas.messages)
        .set('loaded', true);
    case cS.ASYNC_SAVE_MESSAGE_SUCCESS:
      return state.updateIn(
        ['utilisateur_messages', 'datas'],
        msg => (action.msg.id === msg.id ? action.msg : msg)
      );
    case GLOBAL_PENDING_START:
      return state.set('pending', true);
    case GLOBAL_PENDING_STOP:
      return state.set('pending', false);
    case LOCATION_CHANGE:
      return state.set('pending', false);
    case SELECTIONNER_RELAIS:
      return state.set('relaiId', action.payload.relaiId);
    case SET_STELLAR_KEYS:
      return state.set('stellarKeys', action.payload.stellarKeys);
    case 'WS/NOMBRE_CLIENTS':
      return state.set('nombre_clients', action.datas.nombre_clients);
    case REHYDRATE: {
      const incoming = action.payload.global;
      if (!incoming) return state;
      const stellarKeys = incoming.stellarKeys;
      return state
        .set('relaiId', incoming.relaiId)
        .set('stellarKeys', { stellarKeys });
    }
    default:
      return state;
  }
}

export default notificationsReducer;
