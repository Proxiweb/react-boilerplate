/*
 *
 * LanguageProvider reducer
 *
 */

const initialState = {
  utilisateurs: []
};

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    // case CHANGE_LOCALE:
    //   return { ...state, locale: action.locale };
    default:
      return state;
  }
}

export default dashboardReducer;
