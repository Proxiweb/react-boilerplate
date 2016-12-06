import { createSelector } from 'reselect';
// import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
import flatten from 'lodash.flatten';

import { selectAuthUtilisateurId, selectUserId } from 'containers/CompteUtilisateur/selectors';
/**
 * Direct selector to the commande state domain
 */
const selectCommandeDomain = () => (state) => state.commandes || null;
export const selectParams = () => (state, props) => props.params;
export const selectCommandeId = () => (state, props) => props.params.commandeId;
export const selectRelaisId = () => (state, props) => props.params.relaiId;
const selectTypeProduitId = () => (state, props) => props.params.typeProduitId;
const selectProduitId = () => (state, props) => props.params.produitId;
// const selectRelaisId = () => () => 'e3f38e82-9f29-46c6-a0d7-3181451455a4';

const getModel = (substate, name) => {
  try {
    return substate.datas.entities[name];
  } catch (e) {
    return null;
  }
};

export const selectCommandes = () => createSelector(
  [selectCommandeDomain()],
  (substate) => getModel(substate, 'commandes')
);

export const selectCommandesUtilisateurs = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'commandeUtilisateurs')
);

export const selectCommandeContenus = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'commandeContenus')
);

export const selectFournisseursIds = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'fournisseurs')
);

export const selectFournisseurs = () => createSelector(
  selectFournisseursIds(),
  (fournisseurs) => (fournisseurs ?
    Object.keys(fournisseurs)
                  .map((key) => fournisseurs[key])
                  .filter((fourn) => fourn.visible)
    : null)
);

export const selectProduits = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'produits')
);

export const selectTypesProduits = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'typeProduits')
);

export const selectOffres = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'offres')
);

export const selectLivraisons = () => createSelector(
  selectCommandeDomain(),
  (substate) => getModel(substate, 'livraisons')
);

export const selectUserIdCommandes = () => createSelector(
  selectUserId(),
  selectCommandes(),
  selectCommandesUtilisateurs(),
  (userId, commandes, commandeUtilisateurs) => {
    if (!userId || !commandes || !commandeUtilisateurs) return null;
    return Object
             .keys(commandeUtilisateurs)
             .filter((cuId) => commandeUtilisateurs[cuId].utilisateurId === userId)
             .map((cuId) => commandes[commandeUtilisateurs[cuId].commandeId]);
  }
);

export const selectCommandesRelais = () => createSelector(
  selectCommandes(),
  selectLivraisons(),
  selectRelaisId(),
  (commandes, livraisons, relaiId) => {
    if (!commandes || !livraisons || !relaiId) return null;
    const cmdesRelais = {};
    Object.keys(commandes)
      .filter((commandeId) => {
        let inRelais = false;
        commandes[commandeId].livraisons.forEach((cmdeLivr) => {
          if (livraisons[cmdeLivr].relaiId === relaiId) {
            inRelais = true;
          }
        });
        return inRelais;
      }).forEach((commandeId) => {
        cmdesRelais[commandeId] = commandes[commandeId];
      });
    return cmdesRelais;
  }
);

export const selectOffresRelais = () => createSelector(
  selectOffres(),
  selectRelaisId(),
  (offres, relaisId) => {
    if (!offres) return null;
    return Object.keys(offres).filter((key) => offres[key].active && offres[key].relaiId === relaisId);
  }
);

export const selectResults = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.result
);

/* la commande */
export const selectCommande = () => createSelector(
  selectCommandes(),
  selectCommandeId(),
  (commandes, commandeId) => {
    if (!commandes || !commandeId) return null;
    return commandes[commandeId];
  }
);

/* les fournisseurs de la commande */
export const selectFournisseursCommande = () => createSelector(
  selectCommande(),
  selectFournisseursIds(),
  (commande, fournisseursIds) => {
    if (!commande || !fournisseursIds) return null;
    return commande.fournisseurs.map((key) => fournisseursIds[key]);
  }
);

/* tous les produits de ma commandes */
export const selectCommandeProduits = () => createSelector(
  selectCommande(),
  selectFournisseursIds(),
  selectProduits(),
  (commande, fournisseursIds, produits) => {
    if (!commande || !produits || !fournisseursIds) return null;
    return Object.keys(produits)
            .filter((key) => commande.fournisseurs.indexOf(produits[key].fournisseurId) !== -1)
            .filter((key) => fournisseursIds[produits[key].fournisseurId].visible)
            .map((key) => produits[key])
            .filter((pdt) => pdt.enStock);
  }
);

export const selectCommandeLivraisonsIds = () => createSelector(
  selectCommande(),
  (commande) => {
    if (!commande) return null;
    return commande.livraisons;
  }
);

export const selectCommandeLivraisons = () => createSelector(
  selectCommandeLivraisonsIds(),
  selectLivraisons(),
  (livraisonsIds, livraisons) => {
    if (!livraisonsIds || !livraisons) return null;
    return livraisonsIds.map((key) => livraisons[key]);
  }
);

/* tous les types produits de la commande */
export const selectCommandeTypesProduits = () => createSelector(
  selectCommandeProduits(),
  selectTypesProduits(),
  (produits, typeProduits) => {
    if (!produits || !typeProduits) return null;
    return uniq(produits.map((pdt) => pdt.typeProduitId)).map((id) => typeProduits[id]);
  }
);

/* les commandesUtilisateurs de la commande */
export const selectCommandeCommandeUtilisateurs = () => createSelector(
  selectCommandesUtilisateurs(),
  selectCommandeId(),
  (commandesUtilisateurs, commandeId) => {
    if (!commandesUtilisateurs || !commandeId) { return null; }
    return Object.keys(commandesUtilisateurs)
    .filter((key) => commandesUtilisateurs[key].commandeId === commandeId)
    .map((key) => commandesUtilisateurs[key]);
  }
);

/* les produits pour un typedeProduit donné */
export const selectCommandeProduitsByTypeProduit = () => createSelector(
  selectCommandeProduits(),
  selectTypeProduitId(),
  (produits, typeProduitId) => {
    if (!typeProduitId || !produits) return null;
    return produits.filter((pdt) => pdt.typeProduitId === typeProduitId);
  }
);

/* un produit */
export const selectProduit = () => createSelector(
    selectCommandeProduitsByTypeProduit(),
    selectProduitId(),
    (produits, produitId) => (produits && produitId ? produits.find((pdt) => pdt.id === produitId) : null)
);

/* les offres d'un produit */
export const selectOffresByProduit = () => createSelector(
  selectProduit(),
  selectOffresRelais(),
  selectOffres(),
  (produit, offresRelais, offres) => {
    if (!produit || !offres) return null;
    return offresRelais
            .filter((key) => offres[key].produitId === produit.id)
            .map((key) => offres[key]);
  }
);

/* le fournisseur d'un produit */
export const selectFournisseurProduit = () => createSelector(
  selectProduit(),
  selectFournisseursIds(),
  (produit, fournisseursIds) => {
    if (!produit) return null;
    return fournisseursIds[produit.fournisseurId];
  }
);

//
// export const selectedTypeProduct = () => createSelector(
//     selectTypeProduitId(),
//     selectCommandeTypesProduits(),
//     (typeProduitId, typesProduits) => (typesProduits && typeProduitId ? typesProduits.find((type) => type.id === typeProduitId) : null)
// );

/* commandesContenus de la commande */
export const selectCommandeCommandeContenus = () => createSelector(
  [selectCommandeCommandeUtilisateurs()],
  (commandesUtilisateurs) => {
    if (!commandesUtilisateurs) { return null; }
    return flatten(commandesUtilisateurs.map((cu) => cu.contenus));
  }
);


export const selectQuantiteOffresAchetees = () => createSelector(
  [selectOffresByProduit(), selectCommandeCommandeContenus(), selectCommandeContenus()],
  (offres, commandeCommandeContenus, commandeContenus) => {
    if (!offres) return null;
    return offres.map((offre) => ({
      ...offre,
      quantiteTotal: (commandeCommandeContenus && commandeContenus ?
                        commandeCommandeContenus
                          .map((key) => commandeContenus[key])
                          .filter((contenu) => contenu && contenu.offreId === offre.id)
                          .reduce((memo, contenu) => memo + contenu.quantite, 0) :
                        0
                     ),
    }));
  }
);


export const selectAuthUtilisateurCommandeUtilisateur = () => createSelector(
  [selectCommandeCommandeUtilisateurs(), selectAuthUtilisateurId(), selectCommandeContenus()],
  (commandeCommandeUtilisateurs, utilisateurId, commandeContenus) => {
    if (!commandeCommandeUtilisateurs || !utilisateurId || !commandeContenus) { return null; }
    const cCu = commandeCommandeUtilisateurs.find((cu) => cu.utilisateurId === utilisateurId);
    if (!cCu) return undefined;

    cCu.contenus = cCu.contenus.map((contenuId) => commandeContenus[contenuId]);
    return cCu;
  }
);

export const selectUserIdCommandeUtilisateur = () => createSelector(
  [
    selectCommandeCommandeUtilisateurs(),
    selectUserId(),
    selectCommandeContenus(),
    selectCommandeId(),
  ],
  (commandeCommandeUtilisateurs, utilisateurId, commandeContenus, commandeId) => {
    if (!commandeCommandeUtilisateurs || !utilisateurId || !commandeContenus || !commandeId) { return null; }
    console.log('select!', commandeCommandeUtilisateurs);
    console.log(utilisateurId);
    console.log(commandeContenus);
    const cCu = commandeCommandeUtilisateurs.find(
      (cu) => cu.utilisateurId === utilisateurId && cu.commandeId === commandeId
    );
    if (!cCu) return undefined;

    cCu.contenus = cCu.contenus ? cCu.contenus.map((contenuId) => commandeContenus[contenuId]) : [];
    return cCu;
  }
);

export const selectNombreAcheteurs = () => createSelector(
  [selectCommandeCommandeUtilisateurs(), selectCommandeContenus()],
  (commandeCommandeContenus, commandeContenus) => {
    if (!commandeContenus) return null;
    if (commandeCommandeContenus.length === 0) return 0;
    return uniq(
      commandeCommandeContenus
        .map((contId) => commandeContenus[contId])
        .map((cont) => {
          if (!cont) return {};
          return cont.utilisateurId;
        })
      , 'utilisateurId'
    ).length;
  }
);

export const computeNombreCommandeContenus = () => createSelector(
  selectCommandeContenus(),
  (commandeContenus) => Object.keys(commandeContenus).length
);

export const selectAsyncState = () => createSelector(
  selectCommandeDomain(),
  (substate) => ({ pending: substate.pending, error: substate.error })
);

export default selectCommandes;
