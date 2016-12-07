import { take, call, put, select } from 'redux-saga/effects';
import apiClient from 'utils/apiClient';
import { addMessage, startGlobalPending, stopGlobalPending } from 'containers/App/actions';
import { logout } from 'containers/Login/actions';
import omit from 'lodash/omit';
import assign from 'lodash/assign';

export function* apiFetcherSaga() {
  while (true) { // eslint-disable-line
    const action = yield take('*');

    if (action.type.match(/^\w+\/\w+\/ASYNC_([A-Z_0-9]+)_START$/)) {  //  format xxx/xxx/ASYNC_[UNE_ACTION]_START

      const actionSuffix = action.type.split('/');
      const actionTypeSplt = actionSuffix[2].split('_');

      const {actionType, url, ...rest} = action;  // eslint-disable-line
      const sfx = `${actionSuffix[0]}/${actionSuffix[1]}/`;

      actionTypeSplt.pop();
      actionTypeSplt.push('SUCCESS');
      const success = sfx + Array.from(actionTypeSplt).join('_');

      actionTypeSplt.pop();
      actionTypeSplt.push('ERROR');
      const err = sfx + actionTypeSplt.join('_');

      const state = yield select();
      const headers = state.compteUtilisateur.token ? { Authorization: `Bearer ${state.compteUtilisateur.token}`, ...action.headers } : { ...action.headers };
      const { msgPending, msgSuccess, msgError } = action;
      const query = action.query || {};
      const datas = action.datas || {};
      const method = action.method || 'get';
      const options = { query, datas, headers, method };

      try {
        yield put(startGlobalPending());
        const reqUrl = url.slice(0, 4) === 'http' ? url : `/api/${url}`;
        const res = yield call(apiClient[method], reqUrl, options);
        yield put(assign({ type: success, datas: res.datas, req: omit(action, 'type'), msgPending, msgSuccess, msgError }));
        yield put(stopGlobalPending());
        if (msgSuccess) {
          yield put(addMessage({ type: 'success', text: msgSuccess }));
        }
      } catch (exception) {
          console.log('e', exception);
        yield put(stopGlobalPending());
        if (exception.message && exception.message && exception.message.message === 'La session a expirée') {
          yield put(addMessage({
            type: 'error',
            text: 'La session a expirée, veuillez vous re-connecter',
          }));
          console.log('err ----- ', err);
          yield put(assign({ type: err, msgPending, msgSuccess, msgError: 'La session a expirée, veuillez vous re-connecter' }));
          yield put(logout('/login'));
        } else {
            console.log('catch',err);
          yield put(assign({ type: err, msgPending, msgSuccess, msgError: (msgError || exception.message.error), exception: { ...exception } }));
          yield put(addMessage({
            type: 'error',
            text: msgError || exception.message.message,
          }));
        }
      }
    }
  }
}

export default [
  apiFetcherSaga,
];
