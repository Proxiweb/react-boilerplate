import c from './constants';
import update from 'react-addons-update';

const initialState = {
  datas: [],
};

const majRelais = (state, relais) => {
  const arr = [...state.datas];
  return update(
    state,
    { datas:
      { $set: arr.map((a) => (a.id === relais.id ? relais : a)) },
    }
  );
};

const adminRelaisReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_RELAIS_SUCCESS:
      return { ...state, datas: action.datas.relais };
    case c.ASYNC_SAVE_RELAIS_SUCCESS:
      return majRelais(state);
    default:
      return state;
  }
};

export default adminRelaisReducer;
