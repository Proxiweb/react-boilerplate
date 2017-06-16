// makeSelectLocationState expects a plain JS object for the routing state
import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');
export const selectParams = () => (state, props) => props.params;

const makeSelectPending = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('pending')
);

const makeSelectRelaiId = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('relaiId')
);

const makeSelectStellarKeys = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('stellarKeys')
);

const makeSelectNombreClients = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('nombre_clients')
);

const makeSelectMessages = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('utilisateur_messages')
);

const makeSelectMessagesUtilisateurLoaded = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['utilisateur_messages', 'loaded'])
);


const makeSelectMessageUtilisateur = () => createSelector(
  selectGlobal,
  selectParams(),
  (globalState, params) =>
    globalState
      .getIn(['utilisateur_messages', 'datas'])
      .find(msg => msg.get('id') === params.get('messageId'))
);

export const makemakeSelectPending = () => state => state.global.pending;
export const selectRelaiId = () => state => state.global.relaiId;
export const selectStellarKeys = () => state => state.global.stellarKeys;
export const makeSelectNombreClients = () => state => state.global.nombre_clients;
const selectMessages = () => state => state.global.utilisateur_messages;
export const selectMessagesUtilisateurLoaded = () =>
  createSelector(selectMessages(), messages => messages && messages.loaded);
export const selectMessagesUtilisateur = () =>
  createSelector(selectMessages(), msg => (msg ? msg.datas : null));
export const selectMessage = () =>
  createSelector(
    selectMessagesUtilisateur(),
    selectParams(),
    (messages, params) => (messages ? messages.find(msg => msg.id === params.messageId) : null)
  );

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  makeSelectPending,
  makeSelectRelaiId,
  makeSelectStellarKeys,
  makeSelectMessages,
  makeSelectNombreClients,
  makeSelectMessageUtilisateur,
  makeSelectMessagesUtilisateurLoaded,
  makeSelectLocationState,
};
