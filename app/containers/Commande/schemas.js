import { Schema, arrayOf } from "normalizr";

const commandes = new Schema("commandes");
const commandeUtilisateurs = new Schema("commandeUtilisateurs");
const utilisateurs = new Schema("utilisateurs");
const fournisseurs = new Schema("fournisseurs");
const commandeContenus = new Schema("commandeContenus");
const offres = new Schema("offres");
const relais = new Schema("relais");
const produits = new Schema("produits");
const typesProduits = new Schema("typesProduits");

commandeUtilisateurs.define({
  utilisateur: utilisateurs,
  contenus: arrayOf(commandeContenus)
});

commandeContenus.define({
  offre: offres
});

// offres.define({
//   commandeContenus: arrayOf(commandeContenus),
// });

produits.define({
  offres: arrayOf(offres),
  typeProduit: typesProduits
});

// typesProduits.define({
//   unite: unites,
// });

fournisseurs.define({
  produits: arrayOf(produits),
  commandes: arrayOf(commandes)
});

commandes.define({
  commandeUtilisateurs: arrayOf(commandeUtilisateurs),
  fournisseurs: arrayOf(fournisseurs)
});

export const schemas = {
  RELAIS: relais,
  FOURNISSEURS: fournisseurs,
  PRODUITS: produits,
  TYPES_PRODUITS: typesProduits,
  COMMANDE_UTILISATEURS: commandeUtilisateurs,
  COMMANDE_CONTENUS: commandeContenus,
  COMMANDES: commandes,
  UTILISATEURS: utilisateurs,
  OFFRES: offres
};
