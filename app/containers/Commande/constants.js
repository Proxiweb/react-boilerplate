/*
 *
 * Commande constants
 *
 */
import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const commandesConst = generateConstants('app/Commande', 'load_commandes');
const AJOUTER = 'app/Commande/AJOUTER';

export default assign(commandesConst, { AJOUTER });
