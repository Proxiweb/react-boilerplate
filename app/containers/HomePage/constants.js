import generateConstants from 'utils/asyncSagaConstants';
import assign from 'lodash/assign';

const datas1Const = generateConstants('app/Homepage', 'load_datas_1');
const constants = assign(datas1Const, generateConstants('app/Homepage', 'load_datas_2'));

export default constants;
