/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reduxCatch from 'redux-catch';
import createSocketIoMiddleware from 'redux-socket.io';
// import Raven from 'raven-js';

import io from 'socket.io-client/socket.io';

// import { ADD_EFFECT } from 'containers/Login/constants';

import createReducer from './reducers';

// Raven.config('https://1a73e161db764041ae0c12734942e6ab@sentry.io/131956').install();

const errorHandler = (error, getState, lastAction /* , dispatch*/) => {
  /* eslint-disable */
  console.error(error);
  console.debug('current state', getState());
  console.debug('last action was', lastAction);
  // Raven.captureException(error);
  /* eslint-enable */
};

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => noop => noop);

const socket = io('', { path: '/ws' });

const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER/');

export default function configureStore(initialState = {}, history) {
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    socketIoMiddleware,
    reduxCatch(errorHandler),
  ];

  const enhancers = [applyMiddleware(...middlewares), devtools()];

  const store = createStore(createReducer(), initialState, compose(...enhancers));

  // Create hook for async sagas
  store.runSaga = sagaMiddleware.run;

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    System.import('./reducers').then(reducerModule => {
      const createReducers = reducerModule.default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  }

  // Initialize it with no other reducers
  store.asyncReducers = {};
  return store;
}
