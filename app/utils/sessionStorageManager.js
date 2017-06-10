import assign from "lodash/assign";

export function getStateFromStorage(key, initialState, appyToState = {}) {
  const wsState = window.sessionStorage.getItem(key);
  if (!wsState) {
    // no state : return default initialState
    window.sessionStorage.setItem(key, JSON.stringify(initialState));
    return initialState;
  }

  if (appyToState) {
    const stateUpdated = assign(JSON.parse(wsState), appyToState);
    window.sessionStorage.setItem(key, JSON.stringify(stateUpdated));
    return stateUpdated;
  }

  return JSON.parse(wsState);
}

export function storeState(key, state) {
  window.sessionStorage.setItem(key, JSON.stringify(state));
  return state;
}
