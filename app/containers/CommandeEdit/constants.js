/*
 *
 * CommandeEdit constants
 *
 */
import assign from 'lodash/assign';
import generateConstants from 'utils/asyncSagaConstants';

const AJOUTER_OFFRE = 'app/CommandeEdit/AJOUTER_OFFRE';
const SUPPRIMER_OFFRE = 'app/CommandeEdit/SUPPRIMER_OFFRE';
const CHANGE_DISTRIBUTION = 'app/CommandeEdit/CHANGE_DISTRIBUTION';
const SET_DISTRIBUTION = 'app/CommandeEdit/SET_DISTRIBUTION';
const LOAD_COMMANDE = 'app/CommandeEdit/LOAD_COMMANDE';
const MODIFIE_TOTAUX = 'app/CommandeEdit/MODIFIE_TOTAUX';

const commandeConst = generateConstants('app/CommandeEdit', 'sauvegarder');

export default assign(commandeConst, { AJOUTER_OFFRE, SUPPRIMER_OFFRE, LOAD_COMMANDE, SET_DISTRIBUTION, CHANGE_DISTRIBUTION, MODIFIE_TOTAUX });
