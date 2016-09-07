/*
 *
 * Commande constants
 *
 */
import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const commandesConst = generateConstants('app/Commande', 'load_commandes');
const commandeConst = generateConstants('app/Commande', 'load_commande');
const AJOUTER = 'app/Commande/AJOUTER';
const NOUVEL_ACHAT = 'NOUVEL_ACHAT';
const SUPPRESSION_ACHAT = 'SUPPRESSION_ACHAT';
const MODIF_ACHAT = 'MODIF_ACHAT';

export default assign(commandesConst, commandeConst, { AJOUTER, NOUVEL_ACHAT, SUPPRESSION_ACHAT, MODIF_ACHAT });
