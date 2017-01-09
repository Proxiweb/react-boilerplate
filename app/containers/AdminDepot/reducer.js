import { combineReducers } from 'redux';
import update from 'react-addons-update';
import adminUtilisateursReducer from 'containers/AdminUtilisateurs/reducer';
import adminRelaisReducer from 'containers/AdminRelais/reducer';
import AdminCommunicationReducer from 'containers/AdminCommunication/reducer';
import c from './constants';

const initialState = {
  datas: [],
  total: null,
};

const adminDepotReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_DEPOTS_SUCCESS:
      return { ...state, datas: action.datas.depots, total: action.datas.total };
    case c.ASYNC_LOAD_DEPOTS_RELAIS_START:
      return initialState;
    case c.ASYNC_LOAD_DEPOTS_RELAIS_SUCCESS:
      return { ...state, datas: action.datas.depots };
    case c.ASYNC_AJOUTER_DEPOT_SUCCESS:
      return update(state, { datas: { $push: [action.datas] } });
    default:
      return state;
  }
};

export default combineReducers({
  depots: adminDepotReducer,
  utilisateurs: adminUtilisateursReducer,
  relais: adminRelaisReducer,
  communication: AdminCommunicationReducer,
});
