/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'babel-polyfill';

/* eslint-disable import/no-unresolved, import/extensions */
// Load the favicon, the manifest.json file and the .htaccess file
import 'file?name=[name].[ext]!./favicon.ico';
import '!file?name=[name].[ext]!./manifest.json';
import 'file?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as storage from 'redux-storage';

import FontFaceObserver from 'fontfaceobserver';
import { useScroll } from 'react-router-scroll';
import configureStore from './store';

const openSansObserver = new FontFaceObserver('Open Sans', {});
import styles from './containers/App/styles.css';
// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add(styles.fontLoaded);
}, () => {
  document.body.classList.remove(styles.fontLoaded);
});


// Import Language Provider
import LanguageProvider from './containers/LanguageProvider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import global saga
import globalSagas from './containers/App/sagas';

// Import i18n messages
import { translationMessages } from './i18n';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
// import 'sanitize.css/sanitize.css';
import 'flexboxgrid/css/flexboxgrid.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// starting globals sagas
globalSagas.map(store.runSaga);

// Initialize redux-storage
const load = storage.createLoader(store.engine);
load(store)
    .then((newState) => console.log('Loaded state:', newState))
    .catch(() => console.log('Failed to load previous state'));

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import { selectLocationState } from './containers/App/selectors';
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
import App from './containers/App';
import createRoutes from './routes';
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};

const render = (messages) => {
  injectTapEventPlugin();
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <MuiThemeProvider>
          <Router
            history={history}
            routes={rootRoute}
            render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(useScroll())
            }
          />
        </MuiThemeProvider>
      </LanguageProvider>
    </Provider>,
    document.getElementById('app'),
  );
};


// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  Promise.all([
    System.import('intl'),
    System.import('intl/locale-data/jsonp/en.js'),
  ]).then(() => render(translationMessages));
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { install } from 'offline-plugin/runtime';
install();
