// selectLocationState expects a plain JS object for the routing state
import isEqual from 'lodash/isEqual';

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
};
