/*
 *
 * CommandeEdit constants
 *
 */
import assign from "lodash/assign";
import generateConstants from "utils/asyncSagaConstants";

const INIT_COMMANDE = "app/CommandeEdit/INIT_COMMANDE";
const AJOUTER_OFFRE = "app/CommandeEdit/AJOUTER_OFFRE";
const AUGMENTER_OFFRE = "app/CommandeEdit/AUGMENTER_OFFRE";
const DIMINUER_OFFRE = "app/CommandeEdit/DIMINUER_OFFRE";
const SUPPRIMER_OFFRE = "app/CommandeEdit/SUPPRIMER_OFFRE";
const CHANGE_DISTRIBUTION = "app/CommandeEdit/CHANGE_DISTRIBUTION";
const SET_DISTRIBUTION = "app/CommandeEdit/SET_DISTRIBUTION";
const LOAD_COMMANDE = "app/CommandeEdit/LOAD_COMMANDE";
const MODIFIE_TOTAUX = "app/CommandeEdit/MODIFIE_TOTAUX";

const commandeConst = generateConstants("app/CommandeEdit", "sauvegarder");
const annulerConst = generateConstants("app/CommandeEdit", "annuler");

export default assign(commandeConst, annulerConst, {
  INIT_COMMANDE,
  AJOUTER_OFFRE,
  SUPPRIMER_OFFRE,
  AUGMENTER_OFFRE,
  DIMINUER_OFFRE,
  LOAD_COMMANDE,
  SET_DISTRIBUTION,
  CHANGE_DISTRIBUTION,
  MODIFIE_TOTAUX
});
