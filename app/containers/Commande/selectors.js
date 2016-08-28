import { createSelector } from 'reselect';
import merge from 'lodash.merge';
/**
 * Direct selector to the commande state domain
 */
const selectCommandeDomain = () => state => state.commandes;

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

export const selectResults = () => createSelector(
  selectCommandeDomain(),
  (substate) => substate.datas.result
);

export const selectCommandesDatas = () => createSelector(
  selectCommandeDomain(),
  selectResults(),
  (substate, result) => {
    const { commande, commandeUtilisateur, commandeContenu, utilisateur, offre, produit } = substate.datas.entities;
    if (!commande) return null;

    return result
      .map(id => commande[id])
        .map(cmde => ({
          ...cmde,
          commandeUtilisateurs: cmde.commandeUtilisateurs.map(
            id => commandeUtilisateur[id]
          ).map(cu => ({
            ...cu,
            utilisateur: utilisateur[cu.utilisateur],
            contenus: cu.contenus.map(id => commandeContenu[id])
                        .map(cont => ({
                          ...cont,
                          offre: merge(offre[cont.offre], { produit: produit[offre[cont.offre].produit] }),
                        })),
          })),
        })
      );
  }
);

export const selectCommandesUtilisateur = (utilisateurId) => createSelector(
  selectCommandesDatas(),
  (commandes) => {
    if (!commandes) return null;
    return commandes.filter(commande => commande.commandeUtilisateurs.find(cu => cu.utilisateur.id === utilisateurId));
  }
);

export const selectAsyncState = () => createSelector(
  selectCommandeDomain(),
  (substate) => ({ pending: substate.pending, error: substate.error })
);

export default selectCommandes;
