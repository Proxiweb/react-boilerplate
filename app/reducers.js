/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import update from 'react-addons-update';
import languageProviderReducer from 'containers/LanguageProvider/reducer';

import compteUtilisateur from 'containers/CompteUtilisateur/reducer';
import commandes from 'containers/Commande/reducer';
import admin from 'containers/AdminDepot/reducer';
import global from 'containers/App/reducer';

import { reducer as form } from 'redux-form';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = {
  locationBeforeTransitions: null,
};

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return update(state, { locationBeforeTransitions: { $set: action.payload } });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    global,
    route: routeReducer,
    language: languageProviderReducer,
    ...asyncReducers,
    compteUtilisateur,
    commandes,
    form,
    admin,
  });
}
