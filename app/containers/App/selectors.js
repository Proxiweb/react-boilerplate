// selectLocationState expects a plain JS object for the routing state
import isEqual from 'lodash/isEqual';
import { createSelector } from 'reselect';

export const selectPending = () => state => state.global.pending;
export const selectParams = () => (state, props) => props.params;
export const selectRelaiId = () => state => state.global.relaiId;
export const selectStellarKeys = () => state => state.global.stellarKeys;
export const selectNombreClients = () => state => state.global.nombre_clients;
const selectMessages = () => state => state.global.utilisateur_messages;

export const selectMessagesUtilisateurLoaded = () =>
  createSelector(selectMessages(), messages => messages && messages.loaded);

export const selectMessagesUtilisateur = () =>
  createSelector(selectMessages(), msg => msg ? msg.datas : null);

export const selectMessage = () =>
  createSelector(
    selectMessagesUtilisateur(),
    selectParams(),
    (messages, params) => messages ? messages.find(msg => msg.id === params.messageId) : null,
  );

const selectLocationState = () => {
  let prevRoutingState;

  return state => {
    const routingState = state.route; // or state.route

    if (!isEqual(routingState, prevRoutingState)) {
      prevRoutingState = routingState;
    }

    return prevRoutingState;
  };
};

export {
  selectLocationState,
  // selectMessagesUtilisateurLoaded,
  // selectMessagesUtilisateur,
};
