/*
 *
 * Commande constants
 *
 */
import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const commandesConst = generateConstants('app/Commande', 'load_commandes');
const commandeConst = generateConstants('app/Commande', 'load_commande');
const crCdeConst = generateConstants('app/Commande', 'create_commande');
const savePdtConst = generateConstants('app/Commande', 'save_produit');
const changePhotoConst = generateConstants('app/Commande', 'change_photo_produit');
const saveOffreConst = generateConstants('app/Commande', 'save_offre');
const userCommandesConst = generateConstants('app/Commande', 'load_user_commandes');
const utilisateursConst = generateConstants('app/Commande', 'load_utilisateurs');
const fournisseursConst = generateConstants('app/Commande', 'load_fournisseurs');
const relaisConst = generateConstants('app/Commande', 'load_relais');
const typeProduits = generateConstants('app/Commande', 'load_types_produits');
const AJOUTER = 'app/Commande/AJOUTER';
const NOUVEL_ACHAT = 'NOUVEL_ACHAT';
const SUPPRESSION_ACHAT = 'SUPPRESSION_ACHAT';
const MODIF_ACHAT = 'MODIF_ACHAT';

export default assign(
  commandesConst,
  commandeConst,
  savePdtConst,
  changePhotoConst,
  saveOffreConst,
  userCommandesConst,
  fournisseursConst,
  crCdeConst,
  relaisConst,
  utilisateursConst,
  typeProduits,
  {
    AJOUTER,
    NOUVEL_ACHAT,
    SUPPRESSION_ACHAT,
    MODIF_ACHAT,
  });
