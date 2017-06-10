/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import "babel-polyfill";

/* eslint-disable import/no-unresolved, import/extensions */
// Load the favicon, the manifest.json file and the .htaccess file
import "file?name=[name].[ext]!./favicon.ico";
import "!file?name=[name].[ext]!./manifest.json";
import "file?name=[name].[ext]!./.htaccess";
/* eslint-enable import/no-unresolved, import/extensions */

// Import all the third party stuff
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyRouterMiddleware, Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import { persistStore } from "redux-persist";

import FontFaceObserver from "fontfaceobserver";
import { useScroll } from "react-router-scroll";
import configureStore from "./store";

const openSansObserver = new FontFaceObserver("Ubuntu", {});
import styles from "./containers/App/styles.css";

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(
  () => {
    document.body.classList.add(styles.fontLoaded);
  },
  () => {
    document.body.classList.remove(styles.fontLoaded);
  }
);

window.__localeId__ = "fr";

// Import Language Provider
import LanguageProvider from "./containers/LanguageProvider";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import shader from "shader";
import {
  limeA700,
  orange800,
  grey900,
  blue800,
  red800,
  grey300,
  grey600,
  grey200
} from "material-ui/styles/colors";

// Import global saga
import globalSagas from "./containers/App/sagas";
import loginSagas from "./containers/Login/sagas";

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// When Open Sans is loaded, add a font-family using Open Sans to the body
// the index.html file and this observer)
openSansObserver.load().then(
  () => {
    document.body.classList.add(styles.fontLoaded);
  },
  () => {
    document.body.classList.remove(styles.fontLoaded);
  }
);

// Import i18n messages
import { translationMessages } from "./i18n";
import injectTapEventPlugin from "react-tap-event-plugin";

// flexboxgrid
import "flexboxgrid/css/flexboxgrid.css";
// react-grid-layout
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);
persistStore(store, {
  whitelist: ["compteUtilisateur", "global"], // 'commande'
  debounce: 1500,
  keyPrefix: "pw"
});

// starting globals sagas
globalSagas.map(store.runSaga);
loginSagas.map(store.runSaga);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import { selectLocationState } from "./containers/App/selectors";
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState()
});

// Set up the router, wrapping all Routes in the App component
import App from "./containers/App";
import createRoutes from "./routes";
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store)
};

// cutomize theme
const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
    color: shader(limeA700, -0.1),
    textColor: grey900
  },
  tabs: {
    backgroundColor: shader(limeA700, -0.3),
    selectedTextColor: "white"
  },
  toggle: {
    thumbOnColor: shader(limeA700, -0.4),
    thumbOffColor: shader(limeA700, 0.4),
    trackOnColor: shader(limeA700, 0.2),
    trackOffColor: shader(limeA700, 0.6)
  },
  palette: {
    primary1Color: blue800,
    accent1Color: red800,
    warningColor: orange800,
    groupColor: grey300,
    groupColorBorder: grey600,
    oddColor: grey200,
    tableHeaderBackgroundColor: shader(limeA700, 0.5)
  }
});

const render = messages => {
  injectTapEventPlugin();
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router
            history={history}
            routes={rootRoute}
            render={// Scroll to top when going to a new page, imitating default browser
            // behaviour
            applyRouterMiddleware(useScroll())}
          />
        </MuiThemeProvider>
      </LanguageProvider>
    </Provider>,
    document.getElementById("app")
  );
};

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept("./i18n", () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  Promise.all([System.import("intl"), System.import("intl/locale-data/jsonp/en.js")]).then(() =>
    render(translationMessages)
  );
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { install } from "offline-plugin/runtime";
install();
