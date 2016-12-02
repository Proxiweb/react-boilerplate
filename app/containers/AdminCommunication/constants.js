import generateConstants from 'utils/asyncSagaConstants';
import assign from 'lodash.assign';
export const SET_MESSAGE = 'app/AdminCommunication/SET_MESSAGE';
export const ADD_DESTINATAIRE = 'app/AdminCommunication/ADD_DESTINATAIRE';
export const REMOVE_DESTINATAIRE = 'app/AdminCommunication/REMOVE_DESTINATAIRE';
const load = generateConstants('app/AdminCommunication', 'load_communications');
const del = generateConstants('app/AdminCommunication', 'delete_communication');
const save = generateConstants('app/AdminCommunication', 'save_communication');
export default assign(load, del, save);
