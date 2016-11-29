import { combineReducers } from 'redux';
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
