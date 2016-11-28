import c from './constants';

const initialState = {
  datas: [],
};

const adminUtilisateursReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_UTILISATEURS_SUCCESS:
      return { ...state, datas: action.datas.utilisateurs };
    default:
      return state;
  }
};

export default adminUtilisateursReducer;
