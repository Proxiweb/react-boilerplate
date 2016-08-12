import { take, call, put, select } from 'redux-saga/effects';
import { get } from 'utils/apiClient';
import omit from 'lodash/omit';
import assign from 'lodash/assign';

export function* apiFetcherSaga() {
  while (true) { // eslint-disable-line
    const action = yield take('*');

    if (action.type.match(/^\w+\/\w+\/ASYNC_([A-Z_0-9]+)_START$/)) {  //  format xxx/xxx/ASYNC_UNE_ACTION_START
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
        yield put(assign({ type: err, msgPending, msgSuccess, msgError: (msgError || exception.message.error) }));
      }
    }
  }
}

export default [
  apiFetcherSaga,
];
