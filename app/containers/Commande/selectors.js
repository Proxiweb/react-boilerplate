import { createSelector } from 'reselect';
import { Map, List } from 'immutable';
import isAfter from 'date-fns/is_after';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';

import {
  makeSelectAuthUtilisateurId,
  makeSelectUserId,
} from 'containers/CompteUtilisateur/selectors';
/**
 * Direct selector to the commande state domain
 */
export const makeSelectDomain = () => state => state.get('commandes');

export const makeSelectParams = () => (state, props) => props.params;
export const makeSelectCommandeId = () => (state, props) =>
  props.params.commandeId;
export const makeSelectRelaisId = () => (state, props) => props.params.relaiId;
export const makeSelectFournisseurId = () => (state, props) =>
  props.params.fournisseurId;
export const makeSelectCotisationId = () => state => state.cotisationId;
const makeSelectTypeProduitId = () => (state, props) =>
  props.params.typeProduitId;
const makeSelectProduitId = () => (state, props) => props.params.produitId;

const makeSelectNow = () => () => new Date();

export const makeSelectCommandes = () =>
  createSelector([makeSelectDomain()], substate =>
    substate.getIn(['datas', 'entities', 'commandes'], null)
  );

export const makeSelectCommandesUtilisateurs = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'commandeUtilisateurs'], null)
  );

export const makeSelectCommandeContenus = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'commandeContenus'], null)
  );

export const makeSelectFournisseursIds = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'fournisseurs'], null)
  );

export const makeSelectTypesProduitsByIds = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'typesProduits'], null)
  );

export const makeSelectFournisseurs = () =>
  createSelector(makeSelectFournisseursIds(), fournisseurs => {
    if (!fournisseurs) {
      return null;
    }

    return fournisseurs.filter(item => item.get('visible'));
  });

export const makeSelectProduits = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'produits'], null)
  );

export const makeSelectTypesProduits = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'typesProduits'], null)
  );

export const makeSelectOffres = () =>
  createSelector(
    makeSelectDomain(),
    substate => substate.getIn(['datas', 'entities', 'offres'], null),
    null
  );

export const makeSelectRelais = () =>
  createSelector(makeSelectDomain(), substate =>
    substate.getIn(['datas', 'entities', 'relais'], null)
  );

export const makeSelectUtilisateurs = () =>
  createSelector(
    [makeSelectDomain()],
    substate => substate.getIn(['datas', 'entities', 'utilisateurs'], null),
    null
  );

export const makeSelectRelaisSelected = () =>
  createSelector(
    makeSelectRelaisId(),
    makeSelectRelais(),
    (relaisId, relais) => {
      if (!relaisId || !relais) return null;
      return relais.get(relaisId, null);
    }
  );

export const makeSelectFournisseur = () =>
  createSelector(
    makeSelectFournisseurId(),
    makeSelectFournisseursIds(),
    (fournisseurId, fournisseurs) => {
      if (!fournisseurId || !fournisseurs) return null;
      return fournisseurs.get(fournisseurId, null);
    }
  );

export const makeSelectOffreCotisation = () =>
  createSelector(makeSelectOffres(), offres =>
    offres.get('8b330a52-a605-4a67-aee7-3cb3c9274733', null)
  );

export const makeSelectFournisseursRelais = () =>
  createSelector(
    makeSelectRelaisId(),
    makeSelectFournisseurs(),
    (relaisId, fournisseurs) => {
      if (!fournisseurs || !relaisId) return null;
      return fournisseurs.filter(
        f =>
          f.get('livraisonGlobale') ||
          f.get('relais').find(r => r.get('id') === relaisId && r.get('actif'))
      );
    }
  );

export const makeSelectUserIdCommandes = () =>
  createSelector(
    makeSelectUserId(),
    makeSelectCommandes(),
    makeSelectCommandesUtilisateurs(),
    (userId, commandes, commandeUtilisateurs) => {
      if (!userId || !commandes || !commandeUtilisateurs) return null;
      const cus = commandeUtilisateurs
        .filter(
          commandeUtilisateur =>
            commandeUtilisateur.get('utilisateurId') === userId
        )
        .toArray()
        .map(cu => cu.get('commandeId'));

      const cdes = new List();
      const _commandes = commandes.filter(cde => cus.includes(cde.get('id')));
      _commandes.forEach((value, key) => cdes.push(value[key]));
      console.log(cdes);
      return cdes;
    }
  );

export const makeSelectCommandesRelais = () =>
  createSelector(
    makeSelectCommandes(),
    makeSelectRelaisId(),
    (commandes, relaiId) => {
      if (typeof commandes !== 'object') {
        return null;
      }
      return Object.keys(commandes).reduce(
        (memo, id) =>
          commandes[id].distributions.find(d => d.get('relaiId') === relaiId)
            ? { ...memo, [id]: commandes[id] }
            : { ...memo },
        {}
      );
    }
  );

export const makeSelectOffresRelais = () =>
  createSelector(
    makeSelectOffres(),
    makeSelectRelaisId(),
    (offres, relaisId) => {
      if (!offres) return null;
      return Object.keys(offres).filter(
        key => offres[key].active && offres[key].relaiId === relaisId
      );
    }
  );

export const makeSelectResults = () =>
  createSelector(makeSelectDomain(), substate => substate.datas.result);

/* la commande */
export const makeSelectCommande = () =>
  createSelector(
    makeSelectCommandes(),
    makeSelectCommandeId(),
    (commandes, commandeId) => {
      if (!commandes || !commandeId) return null;
      return commandes[commandeId];
    }
  );

/* les fournisseurs de la commande */
export const makeSelectFournisseursCommande = () =>
  createSelector(
    makeSelectCommande(),
    makeSelectFournisseursIds(),
    (commande, fournisseursIds) => {
      if (!commande || !fournisseursIds) return null;
      return commande.datesLimites.map(dL => fournisseursIds[dL.fournisseurId]);
    }
  );

/* tous les produits de ma commandes */
export const makeSelectCommandeProduits = () =>
  createSelector(
    makeSelectCommande(),
    makeSelectFournisseursIds(),
    makeSelectProduits(),
    (commande, fournisseursIds, produits) => {
      if (!commande || !produits || !fournisseursIds) return null;
      return (
        Object.keys(produits)
          .filter(key =>
            commande.datesLimites.find(
              dL => dL.fournisseurId === produits[key].fournisseurId
            )
          )
          // .filter(key => fournisseursIds[produits[key].fournisseurId].visible)
          .map(key => produits[key])
      );
      // .filter(pdt => pdt.enStock);
    }
  );

/* tous les produits de ma commandes */
export const makeSelectCommandeProduitsVisibles = () =>
  createSelector(
    makeSelectCommande(),
    makeSelectCommandeProduits(),
    makeSelectFournisseursIds(),
    makeSelectNow(),
    (commande, produits, fournisseursIds, now) =>
      // if (!commande || !produits || fournisseursIds) return null;
      // console.log(commande, produits, fournisseursIds, now);
      produits.filter(produit => {
        if (
          !produit.enStock ||
          !fournisseursIds[produit.fournisseurId].visible
        ) {
          return false;
        }

        const limitationFournisseur = commande.datesLimites.find(
          dL => dL.fournisseurId === produit.fournisseurId
        );

        if (!limitationFournisseur) return true;

        return (
          limitationFournisseur.dateLimite === null ||
          !isAfter(new Date(), limitationFournisseur.dateLimite)
        );
        return false;
      })
  );

export const makeSelectProduitsRelaisIds = () =>
  createSelector(
    makeSelectFournisseursRelais(),
    makeSelectProduits(),
    (fournisseurs, produits) => {
      if (!fournisseurs || !produits) return null;
      return Object.keys(produits).filter(id =>
        fournisseurs.find(f => produits[id].fournisseurId === f.id)
      );
    }
  );

export const makeSelectProduitsIdsRelaisByTypeProduit = () =>
  createSelector(
    makeSelectProduitsRelaisIds(),
    makeSelectProduits(),
    makeSelectTypeProduitId(),
    (produitsIds, produits, typeProduitId) => {
      if (!produitsIds || !produits || !typeProduitId) return null;
      return produitsIds.filter(
        id => produits[id].typeProduitId === typeProduitId
      );
    }
  );

export const makeSelectProduitsRelaisByTypeProduit = () =>
  createSelector(
    makeSelectProduitsIdsRelaisByTypeProduit(),
    makeSelectProduits(),
    (produitsIds, produits) => {
      if (!produitsIds || !produits) return null;
      return produitsIds.map(id => produits[id]);
    }
  );

export const makeSelectTypesProduitsRelais = () =>
  createSelector(
    makeSelectTypesProduits(),
    makeSelectProduitsRelaisIds(),
    makeSelectProduits(),
    (typesProduitsByIds, produitsIds, produits) => {
      if (!typesProduitsByIds || !produitsIds || !produits) return null;
      return uniq(produitsIds.map(id => produits[id].typeProduitId)).map(
        id => typesProduitsByIds[id]
      );
    }
  );

/* tous les types produits de la commande */
export const makeSelectCommandeTypesProduits = () =>
  createSelector(
    makeSelectCommandeProduits(),
    makeSelectTypesProduits(),
    (produits, typeProduits) => {
      if (!produits || !typeProduits) return null;
      return uniq(produits.map(pdt => pdt.typeProduitId)).map(
        id => typeProduits[id]
      );
    }
  );

/* tous les types produits visibles de la commande */
export const makeSelectCommandeTypesProduitsVisibles = () =>
  createSelector(
    makeSelectFournisseursIds(),
    makeSelectCommandeProduitsVisibles(),
    makeSelectTypesProduits(),
    (fournisseursIds, produits, typeProduits) => {
      if (!produits || !typeProduits) return null;
      return uniq(
        produits
          .filter(pdt => fournisseursIds[pdt.fournisseurId].visible)
          .map(pdt => pdt.typeProduitId)
      ).map(id => typeProduits[id]);
    }
  );

/* les commandesUtilisateurs de la commande */
export const makeSelectCommandeCommandeUtilisateurs = () =>
  createSelector(
    makeSelectCommandesUtilisateurs(),
    makeSelectCommandeId(),
    (commandesUtilisateurs, commandeId) => {
      if (!commandesUtilisateurs || !commandeId) {
        return null;
      }
      return Object.keys(commandesUtilisateurs)
        .filter(key => commandesUtilisateurs[key].commandeId === commandeId)
        .map(key => commandesUtilisateurs[key]);
    }
  );

export const makeSelectCommandeStellarAdresse = () =>
  createSelector(
    makeSelectCommande(),
    commande => (commande.stellarKeys ? commande.stellarKeys.adresse : null)
  );

/* les produits pour un typedeProduit donné */
export const makeSelectCommandeProduitsByTypeProduit = () =>
  createSelector(
    makeSelectCommandeProduits(),
    makeSelectTypeProduitId(),
    (produits, typeProduitId) => {
      if (!typeProduitId || !produits) return null;
      return produits.filter(pdt => pdt.typeProduitId === typeProduitId);
    }
  );

/* un produit */
export const makeSelectProduitCommande = () =>
  createSelector(
    makeSelectCommandeProduitsByTypeProduit(),
    makeSelectProduitId(),
    (produits, produitId) =>
      produits && produitId ? produits.find(pdt => pdt.id === produitId) : null
  );

/* les offres commande d'un produit */
export const makeSelectOffresCommandeByProduit = () =>
  createSelector(
    makeSelectProduitCommande(),
    makeSelectOffresRelais(),
    makeSelectOffres(),
    (produit, offresRelais, offres) => {
      if (!produit || !offres) return null;
      return offresRelais
        .filter(key => offres[key].produitId === produit.id)
        .map(key => offres[key]);
    }
  );

/* les offres relais d'un produit
* @TODO améliore cf selectOffresCommandeByProduit
*/
export const makeSelectOffresDuProduit = () =>
  createSelector(
    makeSelectProduitId(),
    makeSelectOffres(),
    (produitId, offres) => {
      if (!produitId || !offres) return null;
      return Object.keys(offres)
        .filter(key => offres[key].produitId === produitId)
        .map(key => offres[key]);
    }
  );

/* le fournisseur d'un produit */
export const makeSelectFournisseurProduit = () =>
  createSelector(
    makeSelectProduitCommande(),
    makeSelectFournisseursIds(),
    (produit, fournisseursIds) => {
      if (!produit) return null;
      return fournisseursIds[produit.fournisseurId];
    }
  );

/* les produits d'fournisseur */
export const makeSelectFournisseurProduits = () =>
  createSelector(
    makeSelectProduits(),
    makeSelectFournisseurId(),
    (produits, fournisseurId) => {
      if (!produits || !fournisseurId) return null;
      return Object.keys(produits)
        .filter(key => produits[key].fournisseurId === fournisseurId)
        .map(key => produits[key]);
    }
  );

/* commandes d'un fournisseur */
export const makeSelectFournisseurCommandes = () =>
  createSelector(
    makeSelectCommandes(),
    makeSelectFournisseurId(),
    makeSelectFournisseursIds(),
    (commandes, fournisseurId, fournisseursIds) => {
      if (
        !commandes ||
        !fournisseurId ||
        !fournisseursIds ||
        !fournisseursIds[fournisseurId].commandes
      ) {
        return null;
      }

      return fournisseursIds[fournisseurId].commandes.map(id => commandes[id]);
    }
  );

//
// export const makeSelectedTypeProduct = () => createSelector(
//     makeSelectTypeProduitId(),
//     selectCommandeTypesProduits(),
//     (typeProduitId, typesProduits) => (typesProduits && typeProduitId ? typesProduits.find((type) => type.id === typeProduitId) : null)
// );

/* commandesContenus de la commande */
export const makeSelectCommandeCommandeContenus = () =>
  createSelector(
    [makeSelectCommandeCommandeUtilisateurs()],
    commandesUtilisateurs => {
      if (!commandesUtilisateurs) {
        return null;
      }
      return flatten(commandesUtilisateurs.map(cu => cu.contenus));
    }
  );

export const makeSelectOffresProduitAvecTotalAchats = () =>
  createSelector(
    [
      makeSelectOffresCommandeByProduit(),
      makeSelectCommandeCommandeContenus(),
      makeSelectCommandeContenus(),
    ],
    (offres, commandeCommandeContenus, commandeContenus) => {
      if (!offres) return null;
      return offres.map(offre => ({
        ...offre,
        quantiteTotal: commandeCommandeContenus && commandeContenus
          ? commandeCommandeContenus
              .map(key => commandeContenus[key])
              .filter(contenu => contenu && contenu.offreId === offre.id)
              .reduce((memo, contenu) => memo + contenu.quantite, 0)
          : 0,
      }));
    }
  );

export const makeSelectAuthUtilisateurCommandeUtilisateur = () =>
  createSelector(
    [
      makeSelectCommandeCommandeUtilisateurs(),
      makeSelectAuthUtilisateurId(),
      makeSelectCommandeContenus(),
    ],
    (commandeCommandeUtilisateurs, utilisateurId, commandeContenus) => {
      if (
        !commandeCommandeUtilisateurs ||
        !utilisateurId ||
        !commandeContenus
      ) {
        return null;
      }
      const cCu = commandeCommandeUtilisateurs.find(
        cu => cu.utilisateurId === utilisateurId
      );
      if (!cCu) return undefined;

      cCu.contenus = cCu.contenus.map(contenuId => commandeContenus[contenuId]);
      return cCu;
    }
  );

export const makeSelectUserIdCommandeUtilisateur = () =>
  createSelector(
    [
      makeSelectCommandeCommandeUtilisateurs(),
      makeSelectUserId(),
      makeSelectCommandeContenus(),
      makeSelectCommandeId(),
    ],
    (
      commandeCommandeUtilisateurs,
      utilisateurId,
      commandeContenus,
      commandeId
    ) => {
      if (
        !commandeCommandeUtilisateurs ||
        !utilisateurId ||
        !commandeContenus ||
        !commandeId
      ) {
        return null;
      }
      const cCu = commandeCommandeUtilisateurs.find(
        cu => cu.utilisateurId === utilisateurId && cu.commandeId === commandeId
      );
      if (!cCu) return undefined;

      cCu.contenus = cCu.contenus
        ? cCu.contenus.map(contenuId => commandeContenus[contenuId])
        : [];
      return cCu;
    }
  );

export const makeSelectNombreAcheteurs = () =>
  createSelector(
    [makeSelectCommandeCommandeUtilisateurs(), makeSelectCommandeContenus()],
    (commandeCommandeContenus, commandeContenus) => {
      if (!commandeContenus) return null;
      if (commandeCommandeContenus.length === 0) return 0;
      return uniq(
        commandeCommandeContenus
          .map(contId => commandeContenus[contId])
          .map(cont => {
            if (!cont) return {};
            return cont.utilisateurId;
          }),
        'utilisateurId'
      ).length;
    }
  );

export const computeNombreCommandeContenus = () =>
  createSelector(
    makeSelectCommandeContenus(),
    commandeContenus => Object.keys(commandeContenus).length
  );

export const makeSelectAsyncState = () =>
  createSelector(makeSelectDomain(), substate => ({
    pending: substate.pending,
    error: substate.error,
  }));

export default makeSelectCommandes;
