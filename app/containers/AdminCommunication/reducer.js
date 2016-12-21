import c, { SET_MESSAGE, ADD_DESTINATAIRE, REMOVE_DESTINATAIRE } from './constants';
import update from 'react-addons-update';
import findIndex from 'lodash/findIndex';
import assign from 'lodash/assign';

const initialState = {
  datas: [],
  message: {
    sms: '',
    objet: '',
    html: '<p>test</p>',
  },
  destinataires: [],
};

const addDest = (state, action) => {
  const idx = findIndex(state.destinataires, { id: action.id });

  if (idx === -1) {
    return update(state, { destinataires: { $push: [action] } });
  }

  const dest = assign(state.destinataires[idx], { etat: 'attente' });
  if (action.telPortable) dest.telPortable = action.telPortable;
  if (action.email) dest.email = action.email;


  return update(state, { destinataires: { [idx]: { $set: dest } } });
};

const removeDest = (state, action) => {
  const idx = findIndex(state.destinataires, { id: action.id });
  const dest = assign(state.destinataires[idx]);
  delete dest[action.moyen];

  if (!dest.email && !dest.telPortable) {
    return update(state, { destinataires: { $set: state.destinataires.filter((d) => d.id !== dest.id) } });
  }

  return update(state, { destinataires: { [idx]: { $set: dest } } });
};

const deleteCom = (state) => state;

const adminCommunicationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ASYNC_LOAD_COMMUNICATIONS_SUCCESS:
      return { ...state, datas: action.datas.communications };
    case c.ASYNC_DELETE_COMMUNICATION_SUCCESS:
      return deleteCom(state, action);
    case SET_MESSAGE:
      return { ...state, message: action.message };
    case ADD_DESTINATAIRE:
      return addDest(state, action.payload);
    case REMOVE_DESTINATAIRE:
      return removeDest(state, action.payload);
    default:
      return state;
  }
};

export default adminCommunicationsReducer;
