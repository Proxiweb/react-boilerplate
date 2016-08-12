import { take, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';

export function* apiFetcherSaga() {
  while (true) {
    const action = yield take('*');
    const actionSuffix = action.type.split('/');

    if (actionSuffix.length === 3) {
      const actionTypeSplt = actionSuffix[2].split('_');
      if (actionTypeSplt[0] === 'ASYNC' && actionTypeSplt[actionTypeSplt.length - 1] === 'START') {
        const {actionType, url, ...datas} = action;  // eslint-disable-line
        const sfx = `${actionSuffix[0]}/${actionSuffix[1]}/`;

        actionTypeSplt.pop();
        actionTypeSplt.push('SUCCESS');
        const success = sfx + Array.from(actionTypeSplt).join('_');

        actionTypeSplt.pop();
        actionTypeSplt.push('ERROR');
        const err = sfx + actionTypeSplt.join('_');

        const state = yield select();
        const headers = state.compteUtilisateur.token ? { headers: { Authorization: `Bearer ${state.compteUtilisateur.token}` } } : {};

        const res = yield call(request, `/api/${url}`, headers);
        if (!res.err) {
          yield put({ type: success, ...res.data });
        } else {
          yield put({ type: err, msg: res.err });
        }
      }
    }
  }
}

export default [
  apiFetcherSaga,
];
