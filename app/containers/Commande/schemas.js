import { Schema, arrayOf } from 'normalizr';

const commandes = new Schema('commandes');
const commandeUtilisateurs = new Schema('commandeUtilisateurs');
const utilisateurs = new Schema('utilisateurs');
const fournisseurs = new Schema('fournisseurs');
const commandeContenus = new Schema('commandeContenus');
const offres = new Schema('offres');
const livraisons = new Schema('livraisons');
const relais = new Schema('relais');
const produits = new Schema('produits');
const typeProduits = new Schema('typeProduits');

commandeUtilisateurs.define({
  // utilisateur,
  contenus: arrayOf(commandeContenus),
});

livraisons.define({
  relai: relais,
});

// offres.define({
//   commandeContenus: arrayOf(commandeContenus),
// });

produits.define({
  offres: arrayOf(offres),
  typeProduit: typeProduits,
});

fournisseurs.define({
  produits: arrayOf(produits),
});

commandes.define({
  commandeUtilisateurs: arrayOf(commandeUtilisateurs),
  fournisseurs: arrayOf(fournisseurs),
  livraisons: arrayOf(livraisons),
});

export const schemas = {
  RELAIS: relais,
  FOURNISSEURS: fournisseurs,
  PRODUITS: produits,
  COMMANDE_UTILISATEURS: commandeUtilisateurs,
  COMMANDE_CONTENUS: commandeContenus,
  COMMANDES: commandes,
  UTILISATEURS: utilisateurs,
  OFFRES: offres,
  LIVRAISONS: livraisons,
};
