import { Schema, arrayOf } from 'normalizr';

const commande = new Schema('commande');
const commandeUtilisateur = new Schema('commandeUtilisateur');
const utilisateur = new Schema('utilisateur');
const commandeContenu = new Schema('commandeContenu');
const offre = new Schema('offre');
const produit = new Schema('produit');

offre.define({
  produit,
});

commandeContenu.define({
  offre,
});

commandeUtilisateur.define({
  utilisateur,
  contenus: arrayOf(commandeContenu),
});

commande.define({
  commandeUtilisateurs: arrayOf(commandeUtilisateur),
});

export const schemas = {
  COMMANDE_UTILISATEUR: commandeUtilisateur,
  COMMANDE_CONTENU: commandeContenu,
  COMMANDE: commande,
};
