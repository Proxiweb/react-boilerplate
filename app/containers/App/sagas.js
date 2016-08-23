import { take, call, put, select } from 'redux-saga/effects';
import { get } from 'utils/apiClient';
import Notifications from 'react-notification-system-redux';
import { logout, setAuthErrorMsg } from 'containers/Login/actions';
import omit from 'lodash/omit';
import assign from 'lodash/assign';

export function* apiFetcherSaga() {
  while (true) { // eslint-disable-line
    const action = yield take('*');

    if (action.type.match(/^\w+\/\w+\/ASYNC_([A-Z_0-9]+)_START$/)) {  //  format xxx/xxx/ASYNC_[UNE_ACTION]_START
      const actionSuffix = action.type.split('/');
      const actionTypeSplt = actionSuffix[2].split('_');

      const {actionType, url, ...datas} = action;  // eslint-disable-line
      const sfx = `${actionSuffix[0]}/${actionSuffix[1]}/`;

      actionTypeSplt.pop();
      actionTypeSplt.push('SUCCESS');
      const success = sfx + Array.from(actionTypeSplt).join('_');

      actionTypeSplt.pop();
      actionTypeSplt.push('ERROR');
      const err = sfx + actionTypeSplt.join('_');

      const state = yield select();
      const headers = state.compteUtilisateur.token ? { Authorization: `Bearer ${state.compteUtilisateur.token}` } : {};
      const { msgPending, msgSuccess, msgError } = action;
      const query = action.query || {};

      try {
        const res = yield call(get, `/api/${url}`, headers, query);
        yield put(assign({ type: success, datas: res.datas, req: omit(action, 'type'), msgPending, msgSuccess, msgError }));
      } catch (exception) {
        if (exception.message && exception.message.error === 'La session a expirée') {
          yield put(Notifications.error({
            title: 'Session expirée',
            message: 'La session a expirée, veuillez vous re-connecter',
            // autoDismiss: 7,
          }));
          yield put(assign({ type: err, msgPending, msgSuccess, msgError: 'La session a expirée, veuillez vous re-connecter' }));
          yield put(logout('/login'));
        } else {
          yield put(assign({ type: err, msgPending, msgSuccess, msgError: (msgError || exception.message.error) }));
          yield put(Notifications.success({
            title: 'Erreur',
            message: msgError || exception.message.error,
            // autoDismiss: 7,
          }));
        }
      }
    }
  }
}

export default [
  apiFetcherSaga,
];
