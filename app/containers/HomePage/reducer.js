/*
 *
 * CompteUtilisateur reducer
 *
 */
import update from 'react-addons-update';


import c from './constants';

const dataInitialState = {
  asyncStatus: {
    pending: false,
    error: false,
    success: false,
    message: null,
  },
  datas: null,
};

const initialState = {
  datas1: dataInitialState,
  datas2: dataInitialState,
};

function homepageReducer(state = initialState, action) {
  switch (action.type) {
    case c.ASYNC_LOAD_DATAS_1_START:
      return update(state, { datas1: { asyncStatus: { $set: { pending: true, error: false, success: false, message: action.msgPending } } } });
    case c.ASYNC_LOAD_DATAS_1_SUCCESS:
      return update(state, { datas1: { asyncStatus: { $set: { pending: false, error: false, success: true, message: action.msgSuccess } }, datas: { $set: action.datas } } });
    case c.ASYNC_LOAD_DATAS_1_ERROR:
      return update(state, { datas1: { asyncStatus: { $set: { pending: false, error: true, success: false, message: action.msgError } } } });
    case c.ASYNC_LOAD_DATAS_2_START:
      return update(state, { datas2: { asyncStatus: { $set: { pending: true, error: false, success: false, message: action.msgPending } } } });
    case c.ASYNC_LOAD_DATAS_2_SUCCESS:
      return update(state, { datas2: { asyncStatus: { $set: { pending: false, error: false, success: true, message: action.msgSuccess } }, datas: { $set: action.datas } } });
    case c.ASYNC_LOAD_DATAS_2_ERROR:
      return update(state, { datas2: { asyncStatus: { $set: { pending: false, error: true, success: false, message: action.msgError } } } });
    default:
      return state;
  }
}

export default homepageReducer;
