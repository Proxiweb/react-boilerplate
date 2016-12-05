import c, { SET_MESSAGE, ADD_DESTINATAIRE, REMOVE_DESTINATAIRE } from './constants';
import { findActionType } from 'utils/asyncSagaConstants';

export const loadCommunications = (query = {}) => ({
  type: findActionType('load_communications', c, 'START'),
  url: 'communications',
  query,
});

export const sendCommunication = (apiKey, datas) => ({
  type: findActionType('save_communication', c, 'START'),
  url: 'http://localhost:8585/communications',
  method: 'post',
  datas,
  headers: { 'X-Api-Key': apiKey },
  msgSuccess: 'Message envoyé',
  msgError: 'Erreur lors de l\'envoi',
});

export const deleteCommunication = (id) => ({
  type: findActionType('delete_communication', c, 'START'),
  url: `communications/${id}`,
  method: 'del',
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  message,
});

export const addDestinataire = ({ telPortable, email, identite, id }) => ({
  type: ADD_DESTINATAIRE,
  payload: { telPortable, email, identite, id },
});

/* @moyen 'email' ou 'telPortable' */
export const removeDestinataire = (id, moyen) => ({
  type: REMOVE_DESTINATAIRE,
  payload: { id, moyen },
});
