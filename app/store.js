/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client/socket.io';

// import * as storage from 'redux-storage';
// import createSessionStorageEngine from 'redux-storage-engine-sessionstorage';
// import { LOGIN_SUCCESS, LOGOUT } from 'containers/Login/constants';

import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => (noop) => noop);

const socket = io('', { path: '/ws' });
const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER/');

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  // const sessionStorageEngine = createSessionStorageEngine('redux');
  // const storageMiddleware = storage.createMiddleware(sessionStorageEngine, [], [LOGIN_SUCCESS, LOGOUT]);

  const middlewares = [
    sagaMiddleware,
    // storageMiddleware,
    routerMiddleware(history),
    socketIoMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const store = createStore(
    createReducer(),
    initialState,
    compose(...enhancers)
  );

  // Create hook for async sagas
  store.runSaga = sagaMiddleware.run;

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    System.import('./reducers').then((reducerModule) => {
      const createReducers = reducerModule.default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  }

  // Initialize it with no other reducers
  store.asyncReducers = {};
  return store;
}
