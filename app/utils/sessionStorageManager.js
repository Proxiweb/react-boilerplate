export function getStateFromStorage(key, initialState) {
  const wsState = window.sessionStorage.getItem(key);
  if (!wsState) {
    // no state : return default initialState
    window.sessionStorage.setItem(key, JSON.stringify(initialState));
    return initialState;
  }

  return JSON.parse(wsState);
}

export function storeState(key, state) {
  window.sessionStorage.setItem(key, JSON.stringify(state));
  return state;
}
