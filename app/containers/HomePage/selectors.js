import { createSelector } from 'reselect';

/**
 * Direct selector to the languageToggle state domain
 */
const selectDatas1 = state => state.datas.datas1;
const selectDatas2 = state => state.datas.datas2;

/**
 * Select the language locale
 */

const selectAsyncDatas1 = createSelector(selectDatas1, datas => datas.asyncStatus);

const selectAsyncDatas2 = createSelector(selectDatas2, datas => datas.asyncStatus);

export { selectAsyncDatas1, selectAsyncDatas2 };
