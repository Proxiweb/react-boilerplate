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
    return produits
            .find(pdt => pdt.id === produitId)
            .offres
            .map(offreId => offres[offreId]);
  }
);

export const selectQuantiteOffresAchetees = () => createSelector(
  [selectOffresByProduit(), selectCommandeContenus(), selectCommandeId()],
  (offres, commandeContenus, commandeId) => {
    if (!commandeContenus || !offres) return null;
    return offres.map(offre => ({
      ...offre,
      quantiteTotal: Object.keys(commandeContenus)
                      .map(key => commandeContenus[key])
                      .filter(contenu => contenu.offreId === offre.id && contenu.commandeId === commandeId)
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
        .filter(key => commandeContenus[key].commandeId === commandeId)
        .map(key => commandeContenus[key])
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
