import c from './constants';

const initialState = {
  datas: [],
};

const adminRelaisReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_RELAIS_SUCCESS:
      return { ...state, datas: action.datas.relais };
    default:
      return state;
  }
};

export default adminRelaisReducer;
