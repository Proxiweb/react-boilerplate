import { take, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import c from 'containers/Commande/constants';

// Individual exports for testing
export function* redirectOnCommandeCreated() {
  while(1) {
    yield take(c.ASYNC_CREATE_COMMANDE_SUCCESS);
    window.location = '/';
  }
}

// All sagas to be loaded
export default [
  redirectOnCommandeCreated,
];
