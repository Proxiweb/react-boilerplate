// import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const fournisseurConst = generateConstants('app/Fournisseur', 'load_fournisseur');

export default fournisseurConst;
