import c from './constants';
import merge from 'lodash.merge';
const initialState = {
  datas: [],
};

const adminUtilisateursReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_UTILISATEURS_SUCCESS:
      return { ...state, datas: merge(state.datas, action.datas.utilisateurs) };
    default:
      return state;
  }
};

export default adminUtilisateursReducer;
