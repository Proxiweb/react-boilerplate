import c, { SET_MESSAGE } from './constants';

const initialState = {
  datas: [],
  message: {
    sms: '',
    objet: '',
    html: '<p>test</p>',
  },
};

const adminCommunicationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_COMMUNICATION_SUCCESS:
      return { ...state, datas: action.datas.communications };
    case SET_MESSAGE:
      return { ...state, message: action.message };
    default:
      return state;
  }
};

export default adminCommunicationsReducer;
