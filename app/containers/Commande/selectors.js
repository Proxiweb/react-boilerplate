import { createSelector } from 'reselect';
// import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
/**
 * Direct selector to the commande state domain
 */
const selectCommandeDomain = () => (state) => state.commandes;
export const selectParams = () => (state, props) => props.params;
const selectCommandeId = () => (state, props) => props.params.commandeId;
const selectTypeProduitId = () => (state, props) => props.params.typeProduitId;
const selectProduitId = () => (state, props) => props.params.produitId;
const selectRelaisId = () => () => 'e3f38e82-9f29-46c6-a0d7-3181451455a4';

export const selectCommandes = () => createSelector(
  [selectCommandeDomain()],
  (substate) => substate.datas.entities.commandes
);

export const selectCommandeContenus = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.entities.commandeContenus
);

export const selectFournisseurs = () => createSelector(
  selectCommandeDomain(),
  (substate) => Object.keys(substate.datas.entities.fournisseurs)
                  .map((key) => substate.datas.entities.fournisseurs[key])
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

export const selectOffresRelais = () => createSelector(
  selectOffres(),
  selectRelaisId(),
  (offres, relaisId) => {
    if (!offres) return null;
    const map = Object.keys(offres)
      .filter((key) => {
        return offres[key].active && offres[key].relaiId === relaisId;
      })
      .map((key) => offres[key]);
    return map;
  }
);

export const selectResults = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.result
);

/* tous les produits de ma commandes */
export const selectCommandeProduits = () => createSelector(
  selectCommandes(),
  selectCommandeId(),
  selectFournisseurs(),
  selectProduits(),
  (commandes, commandeId, fournisseurs, produits) => {
    if (!commandeId) return null;
    const fournisseursCommande = commandes[commandeId].fournisseurs;
    return Object.keys(produits)
            .filter((key) => fournisseursCommande.indexOf(produits[key].fournisseurId) !== -1)
            .map((key) => produits[key])
            .filter((pdt) => pdt.enStock);
  }
);

/* tous les types produits de la commande */
export const selectCommandeTypesProduits = () => createSelector(
  selectCommandeProduits(),
  selectTypesProduits(),
  (produits, typeProduits) => {
    if (!produits) return null;
    return uniq(produits.map((pdt) => pdt.typeProduitId)).map((id) => typeProduits[id]);
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
    (produits, produitId) => (produits ? produits.find((pdt) => pdt.produitId === produitId) : null)
);

/* les offres d'un produit */
export const selectOffresByProduit = () => createSelector(
  selectProduit(),
  selectOffresRelais(),
  (produit, offres) => {
    if (!produit || !offres) return null;
    return offres.filter((offre) => offre.produitId === produit.id);
  }
);

//
// export const selectedTypeProduct = () => createSelector(
//     selectTypeProduitId(),
//     selectCommandeTypesProduits(),
//     (typeProduitId, typesProduits) => (typesProduits && typeProduitId ? typesProduits.find((type) => type.id === typeProduitId) : null)
// );

export const selectQuantiteOffresAchetees = () => createSelector(
  [selectOffresByProduit(), selectCommandeContenus(), selectCommandeId()],
  (offres, commandeContenus, commandeId) => {
    if (!commandeContenus || !offres) return null;

    return offres.map((offre) => ({
      ...offre,
      quantiteTotal: Object.keys(commandeContenus)
                      .map((key) => commandeContenus[key])
                      .filter((contenu) => contenu.offreId === offre.id && contenu.commandeId === commandeId)
                      .reduce((memo, contenu) => memo + contenu.quantite, 0),
    }));
  }
);

export const selectNombreAcheteurs = () => createSelector(
  [selectCommandes(), selectCommandeContenus(), selectCommandeId()],
  (commandes, commandeContenus, commandeId) => {
    if (!commandeContenus || !commandeId) return null;
    return uniq(
      Object.keys(commandeContenus)
        .filter((key) => commandeContenus[key].commandeId === commandeId)
        .map((key) => commandeContenus[key])
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
