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
const savePdtConst = generateConstants('app/Commande', 'save_produit');
const changePhotoConst = generateConstants(
  'app/Commande',
  'change_photo_produit',
);
const saveOffreConst = generateConstants('app/Commande', 'save_offre');
const importeOffresConst = generateConstants('app/Commande', 'importe_offres');
const userCommandesConst = generateConstants(
  'app/Commande',
  'load_user_commandes',
);
const utilisateursConst = generateConstants(
  'app/Commande',
  'load_utilisateurs',
);
const cdeUtilisateursConst = generateConstants(
  'app/Commande',
  'load_commande_utilisateurs',
);
const fournisseursConst = generateConstants(
  'app/Commande',
  'load_fournisseurs',
);
const livreCommandeUtilisateurConst = generateConstants(
  'app/CommandeEdit',
  'livre_commande_utilisateur',
);
const supprimerCommandeContenusFournisseurConst = generateConstants(
  'app/Commande',
  'supprimer_commande_contenus_fournisseur',
);
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
  supprimerCommandeContenusFournisseurConst,
  livreCommandeUtilisateurConst,
  importeOffresConst,
  deleteConst,
  crCdeConst,
  relaisConst,
  utilisateursConst,
  cdeUtilisateursConst,
  typeProduits,
  {
    AJOUTER,
    NOUVEL_ACHAT,
    SUPPRESSION_ACHAT,
    MODIF_ACHAT,
  },
);
