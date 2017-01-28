// selectLocationState expects a plain JS object for the routing state
import isEqual from 'lodash/isEqual';
import { createSelector } from 'reselect';

export const selectPending = () => (state) => state.global.pending;
export const selectMessages = () => (state) => {
  return state && state.global.utilisateur_messages;
};
export const selectParams = () => (state, props) => props.params;

const selectMessagesUtilisateurLoaded = createSelector(
  selectMessages(),
  (messages) => messages && messages.loaded,
);
//
// const selectMessagesUtilisateur = createSelector(
//   selectMessages(),
//   (msg) => msg.datas,
// );

const selectLocationState = () => {
  let prevRoutingState;

  return (state) => {
    const routingState = state.route; // or state.route

    if (!isEqual(routingState, prevRoutingState)) {
      prevRoutingState = routingState;
    }

    return prevRoutingState;
  };
};

export {
  selectLocationState,
  selectMessagesUtilisateurLoaded,
};
