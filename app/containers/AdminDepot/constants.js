import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const c = generateConstants('app/AdminDepot', 'load_depots');
const cR = generateConstants('app/AdminDepot', 'load_depots_relais');

export default assign(
  c,
  cR,
);
