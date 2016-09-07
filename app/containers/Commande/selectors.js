import { createSelector } from 'reselect';
// import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
/**
 * Direct selector to the commande state domain
 */
const selectCommandeDomain = () => state => state.commandes;
export const selectParams = () => (state, props) => props.params;
const selectCommandeId = () => (state, props) => props.params.commandeId;
const selectTypeProduitId = () => (state, props) => props.params.typeProduitId;
const selectProduitId = () => (state, props) => props.params.produitId;

/**
 * Other specific selectors
 */


/**
 * Default selector used by Commande
 */

export const selectCommandes = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.commandes
);

export const selectFournisseurs = () => createSelector(
  selectCommandeDomain(),
  (substate) => Object.keys(substate.datas.entities.fournisseurs)
                  .map(key => substate.datas.entities.fournisseurs[key])
                  .filter((fourn) => fourn.visible)
);

export const selectProduits = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.produits
);

export const selectTypesProduits = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.typeProduits
);

export const selectOffres = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.offres
);

export const selectResults = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.result
);

export const selectCommandeProduits = () => createSelector(
  selectCommandes(),
  selectCommandeId(),
  selectFournisseurs(),
  selectProduits(),
  (commandes, commandeId, fournisseurs, produits) => {
    if (!commandeId) return null;
    const fournisseursCommande = commandes[commandeId].fournisseurs;
    return Object.keys(produits)
            .filter(key => fournisseursCommande.indexOf(produits[key].fournisseurId) !== -1)
            .map(key => produits[key])
            .filter(pdt => pdt.enStock);
  }
);

export const selectCommandeTypesProduits = () => createSelector(
  selectCommandeProduits(),
  selectTypesProduits(),
  (produits, typeProduits) => {
    if (!produits) return null;
    return uniq(produits.map(pdt => pdt.typeProduitId)).map(id => typeProduits[id]);
  }
);

export const selectCommandeProduitsByTypeProduit = () => createSelector(
  selectCommandeProduits(),
  selectTypeProduitId(),
  (produits, typeProduitId) => {
    if (!typeProduitId || !produits) return null;
    return produits.filter(pdt => pdt.typeProduitId === typeProduitId);
  }
);

export const selectOffresByProduit = () => createSelector(
  selectCommandeProduitsByTypeProduit(),
  selectProduitId(),
  selectOffres(),
  (produits, produitId, offres) => {
    if (!produitId || !produits) return null;
    console.log('select!');
    return produits
            .find(pdt => pdt.id === produitId)
            .offres
            .map(offreId => offres[offreId]);
  }
);

export const nombreAchats = () => createSelector(
  selectCommandeDomain(),
  (substate) => {
    if (!substate.datas.entities.commandeContenus) return null;
    const contenus = substate.datas.entities.commandeContenus;
    return uniq(
      Object.keys(contenus)
        .filter(key => contenus[key].commandeId === '3b98ddd3-4b59-4d84-9ecc-e2f11297a033')
        .map(key => contenus[key])
      , 'utilisateurId'
    ).length;
  }
);

// export const selectCommandes = () => createSelector(
//   selectCommandeDomain(),
//   selectResults(),
//   (substate, result) => {
//     const { commande, commandeUtilisateur, commandeContenu, utilisateur, offre, produit } = substate.datas.entities;
//     if (!commande) return null;
//
//     return result
//       .map(id => commande[id])
//         .map(cmde => ({
//           ...cmde,
//           commandeUtilisateurs: cmde.commandeUtilisateurs.map(
//             id => commandeUtilisateur[id]
//           ).map(cu => ({
//             ...cu,
//             utilisateur: utilisateur[cu.utilisateur],
//             contenus: cu.contenus.map(id => commandeContenu[id])
//                         .map(cont => ({
//                           ...cont,
//                           offre: merge(offre[cont.offre], { produit: produit[offre[cont.offre].produit] }),
//                         })),
//           })),
//         })
//       );
//   }
// );

// export const selectCommandesUtilisateur = (utilisateurId) => createSelector(
//   selectCommandesDatas(),
//   (commandes) => {
//     if (!commandes) return null;
//     return commandes.filter(commande => commande.commandeUtilisateurs.find(cu => cu.utilisateur.id === utilisateurId));
//   }
// );

export const selectAsyncState = () => createSelector(
  selectCommandeDomain(),
  (substate) => ({ pending: substate.pending, error: substate.error })
);

export default selectCommandes;
