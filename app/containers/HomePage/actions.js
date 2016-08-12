import {
  ASYNC_LOAD_DATAS_1_START,
} from './constants';

export function loadDatas1Start(id) {
  return {
    type: ASYNC_LOAD_DATAS_1_START,
    url: `loadDatas1/${id}`,
    id,
  };
}
