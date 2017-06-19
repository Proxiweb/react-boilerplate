// makeSelectLocationState expects a plain JS object for the routing state
import { createSelector } from 'reselect';

export const makeSelectGlobal = () => state => state.get('global');
export const makeSelectParams = () => (state, props) => props.params;

const makeSelectPending = () =>
  createSelector(makeSelectGlobal(), globalState => globalState.get('pending'));

const makeSelectRelaiId = () =>
  createSelector(makeSelectGlobal(), globalState => globalState.get('relaiId'));

const makeSelectStellarKeys = () =>
  createSelector(makeSelectGlobal(), globalState =>
    globalState.get('stellarKeys')
  );

const makeSelectNombreClients = () =>
  createSelector(makeSelectGlobal(), globalState =>
    globalState.get('nombre_clients')
  );

const makeSelectMessages = () =>
  createSelector(makeSelectGlobal(), globalState =>
    globalState.getIn(['utilisateur_messages', 'datas'])
  );

const makeSelectMessagesUtilisateurLoaded = () =>
  createSelector(makeSelectGlobal(), globalState =>
    globalState.getIn(['utilisateur_messages', 'loaded'])
  );

const makeSelectMessageUtilisateur = () =>
  createSelector(
    makeSelectGlobal(),
    makeSelectParams(),
    (globalState, params) =>
      globalState
        .getIn(['utilisateur_messages', 'datas'])
        .find(msg => msg.get('id') === params.get('messageId'))
  );

// export const makeSelectPending = () => state => state.global.pending;
// export const makeSelectRelaiId = () => state => state.global.relaiId;
// export const makeSelectStellarKeys = () => state => state.global.stellarKeys;
// export const makeSelectNombreClients = () => state => state.global.nombre_clients;
// const selectMessages = () => state => state.global.utilisateur_messages;
// export const makeSelectMessagesUtilisateurLoaded = () =>
//   createSelector(selectMessages(), messages => messages && messages.loaded);
// export const makeSelectMessagesUtilisateur = () =>
//   createSelector(selectMessages(), msg => (msg ? msg.datas : null));
// export const makeSelectMessage = () =>
//   createSelector(
//     selectMessagesUtilisateur(),
//     selectParams(),
//     (messages, params) => (messages ? messages.find(msg => msg.id === params.messageId) : null)
//   );

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return state => {
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
