/*
 *
 * Commande constants
 *
 */

import generateConstants from 'utils/asyncSagaConstants';

const commandesConst = generateConstants('app/Commande', 'load_commandes');

export default commandesConst;
