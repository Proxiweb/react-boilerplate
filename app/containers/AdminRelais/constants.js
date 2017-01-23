import generateConstants from 'utils/asyncSagaConstants';

const load = generateConstants('app/AdminRelais', 'load_relais');
const save = generateConstants('app/AdminRelais', 'save_relais');

export default { ...load, ...save };
