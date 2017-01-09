import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const c = generateConstants('app/AdminDepot', 'load_depots');
const cR = generateConstants('app/AdminDepot', 'load_depots_relais');
const aJ = generateConstants('app/AdminDepot', 'ajouter_depot');

export default assign(
  c,
  cR,
  aJ,
);
