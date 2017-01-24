/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reduxCatch from 'redux-catch';
import createSocketIoMiddleware from 'redux-socket.io';
// import { autoRehydrate } from 'redux-persist';

// import * as storage from 'redux-storage';
// import createEngine from 'redux-storage-engine-localstorage';
// import debounce from 'redux-storage-decorator-debounce';
// import filter from 'redux-storage-decorator-filter';

import io from 'socket.io-client/socket.io';

// import { ADD_EFFECT } from 'containers/Login/constants';

import createReducer from './reducers';

const errorHandler = (error, getState, lastAction/* , dispatch*/) => {
  /* eslint-disable */
  console.error(error);
  console.debug('current state', getState());
  console.debug('last action was', lastAction);
  /* eslint-enable */
  // optionally dispatch an action due to the error using the dispatch parameter
};

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => (noop) => noop);

const socket = io('', { path: '/ws' });
const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER/');

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  // const sessionStorageEngine = createSessionStorageEngine('redux');
  // const engine = debounce(
  //   filter(
  //     createEngine('proxiweb'),
  //     ['compteUtilisateur', 'commande']
  //   ),
  //   1500
  // );
  // const storageMiddleware = storage.createMiddleware(engine);

  const middlewares = [
    sagaMiddleware,
    // storageMiddleware,
    routerMiddleware(history),
    socketIoMiddleware,
    reduxCatch(errorHandler),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
    // autoRehydrate(),
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
