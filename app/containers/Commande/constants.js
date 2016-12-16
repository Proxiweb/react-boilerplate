/*
 *
 * Commande constants
 *
 */
import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const commandesConst = generateConstants('app/Commande', 'load_commandes');
const userCommandesConst = generateConstants('app/Commande', 'load_user_commandes');
const fournisseursConst = generateConstants('app/Commande', 'load_fournisseurs');
const AJOUTER = 'app/Commande/AJOUTER';
const NOUVEL_ACHAT = 'NOUVEL_ACHAT';
const SUPPRESSION_ACHAT = 'SUPPRESSION_ACHAT';
const MODIF_ACHAT = 'MODIF_ACHAT';

export default assign(
  commandesConst,
  userCommandesConst,
  fournisseursConst,
  {
    AJOUTER,
    NOUVEL_ACHAT,
    SUPPRESSION_ACHAT,
    MODIF_ACHAT,
  });
