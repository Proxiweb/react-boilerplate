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
const deleteConst = generateConstants('app/Commande', 'delete_commande');
const diminueCommandeContenuConst = generateConstants('app/Commande', 'diminuer_commande_contenu');
const modifierCommandeContenu = generateConstants('app/Commande', 'modifier_commande_contenu');
const deleteCommandeContenuConst = generateConstants('app/Commande', 'supprimer_commande_contenu');
const savePdtConst = generateConstants('app/Commande', 'save_produit');
const changePhotoConst = generateConstants('app/Commande', 'change_photo_produit');
const saveOffreConst = generateConstants('app/Commande', 'save_offre');
const importeOffresConst = generateConstants('app/Commande', 'importe_offres');
const userCommandesConst = generateConstants('app/Commande', 'load_user_commandes');
const utilisateursConst = generateConstants('app/Commande', 'load_utilisateurs');
const saveUtilisateurConst = generateConstants('app/Commande', 'save_utilisateur');
const cdeUtilisateursConst = generateConstants('app/Commande', 'load_commande_utilisateurs');
const fournisseursConst = generateConstants('app/Commande', 'load_fournisseurs');
const saveFournisseursConst = generateConstants('app/Commande', 'save_fournisseur');
const offresConst = generateConstants('app/Commande', 'load_offres');
const livreCommandeUtilisateurConst = generateConstants('app/CommandeEdit', 'livre_commande_utilisateur');
const payeCommandeUtilisateurConst = generateConstants('app/CommandeEdit', 'paye_commande_utilisateur');
const supprimerCommandeContenusFournisseurConst = generateConstants(
  'app/Commande',
  'supprimer_commande_contenus_fournisseur'
);
const relaisConst = generateConstants('app/Commande', 'load_relais');
const typeProduits = generateConstants('app/Commande', 'load_types_produits');
const AJOUTER = 'app/Commande/AJOUTER';
const INIT_COMMANDE = 'app/Commande/INIT_COMMANDE';
const NOUVEL_ACHAT = 'NOUVEL_ACHAT';
const SUPPRESSION_ACHAT = 'SUPPRESSION_ACHAT';
const MODIF_ACHAT = 'MODIF_ACHAT';
const UPDATE_CATALOGUE_START = 'app/Commande/UPDATE_CATALOGUE_START';
const UPDATE_CATALOGUE_SUCCESS = 'app/Commande/UPDATE_CATALOGUE_SUCCESS';

export default assign(
  commandesConst,
  commandeConst,
  savePdtConst,
  changePhotoConst,
  saveOffreConst,
  userCommandesConst,
  fournisseursConst,
  saveFournisseursConst,
  offresConst,
  supprimerCommandeContenusFournisseurConst,
  livreCommandeUtilisateurConst,
  payeCommandeUtilisateurConst,
  importeOffresConst,
  deleteConst,
  diminueCommandeContenuConst,
  modifierCommandeContenu,
  deleteCommandeContenuConst,
  crCdeConst,
  relaisConst,
  utilisateursConst,
  cdeUtilisateursConst,
  typeProduits,
  saveUtilisateurConst,
  {
    AJOUTER,
    NOUVEL_ACHAT,
    SUPPRESSION_ACHAT,
    MODIF_ACHAT,
    UPDATE_CATALOGUE_START,
    UPDATE_CATALOGUE_SUCCESS,
    INIT_COMMANDE,
  }
);
