import generateConstants from 'utils/asyncSagaConstants';
export const SET_MESSAGE = 'app/AdminCommunication/SET_MESSAGE';
export const ADD_DESTINATAIRE = 'app/AdminCommunication/ADD_DESTINATAIRE';
export const REMOVE_DESTINATAIRE = 'app/AdminCommunication/REMOVE_DESTINATAIRE';
export default generateConstants('app/AdminCommunication', 'load_communications');
