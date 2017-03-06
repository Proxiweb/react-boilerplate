/*
 *
 * Commande actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const loadCommandes = query => ({
  type: findActionType('load_commandes', c, 'START'),
  url: 'commandes',
  query,
  msgPending: 'Chargement commandes',
});

export const loadCommande = (id, query) => ({
  type: findActionType('load_commande', c, 'START'),
  url: `commandes/${id}`,
  query,
  msgPending: 'Chargement commandes',
});

export const deleteCommande = id => ({
  type: findActionType('delete_commande', c, 'START'),
  url: `commandes/${id}`,
  method: 'del',
  datas: { id },
  msgSuccess: 'Commande supprimée',
});

/*
* enlève 1 à quantite
* appelée uniquement avec quantite > 1
*/
export const diminuerCommandeContenu = contenu => ({
  type: findActionType('diminuer_commande_contenu', c, 'START'),
  url: `commande_contenus/${contenu.id}`,
  method: 'put',
  datas: { ...contenu, quantite: contenu.quantite - 1 },
});

/*
* supprime commande_contenu
* appelé quant quantite === 1
*/
export const supprimerCommandeContenu = contenu => ({
  type: findActionType('supprimer_commande_contenu', c, 'START'),
  url: `commande_contenus/${contenu.id}`,
  method: 'del',
  datas: { ...contenu },
  msgSuccess: 'Contenu commande supprimé',
});

export const createCommande = commande => ({
  type: findActionType('create_commande', c, 'START'),
  url: `commandes${commande.id ? `/${commande.id}` : ''}`,
  method: commande.id ? 'put' : 'post',
  datas: { ...commande },
  msgPending: 'Création commande',
  msgSuccess: 'Commande crée',
});

export const livreCommandeUtilisateur = id => ({
  type: findActionType('livre_commande_utilisateur', c, 'START'),
  url: `commande_utilisateurs/${id}/livraison`,
  method: 'post',
  datas: {},
});

export const payerCommandeUtilisateur = datas => ({
  type: findActionType('paye_commande_utilisateur', c, 'START'),
  url: `commande_utilisateurs/${datas.id}/paiement`,
  method: 'post',
  datas: { ...datas },
});

export const saveProduit = (produit, msgSuccess: 'Produit sauvegardé') => ({
  type: findActionType('save_produit', c, 'START'),
  url: `produits${produit.id ? `/${produit.id}` : ''}`,
  method: produit.id ? 'put' : 'post',
  datas: { ...produit },
  msgPending: 'Sauvegarde en cours...',
  msgSuccess,
});

export const changePhoto = (produitId, imageBase64) => ({
  type: findActionType('change_photo_produit', c, 'START'),
  url: 'upload_image',
  method: 'post',
  datas: { produitId, imageBase64 },
  msgPending: 'Modification de la photo...',
  msgSuccess: 'Photo modifiée',
});

export const saveOffre = (offre, msgSuccess = 'Offre sauvegardée') => ({
  type: findActionType('save_offre', c, 'START'),
  url: `offre_produits${offre.id ? `/${offre.id}` : ''}`,
  method: offre.id ? 'put' : 'post',
  datas: { ...offre },
  msgPending: 'Sauvegarde en cours...',
  msgSuccess,
});

export const importeOffres = (fournisseurId, produitId, relaiDestinationId) => ({
  type: findActionType('importe_offres', c, 'START'),
  url: 'offre_produits/importer',
  method: 'post',
  datas: { fournisseurId, produitId, relaiDestinationId },
  msgPending: 'Sauvegarde en cours...',
  msgSuccess: 'Offre importée',
});
/**
* query : { relaiId || id, jointures: true }
**/
export const loadFournisseurs = query => ({
  type: findActionType('load_fournisseurs', c, 'START'),
  url: 'fournisseurs',
  query,
  msgPending: 'Chargement fournisseurs',
});

export const saveFournisseur = (fournisseur, msgSuccess: 'Fournisseur sauvegardé') => ({
  type: findActionType('save_fournisseur', c, 'START'),
  url: `fournisseurs${fournisseur.id ? `/${fournisseur.id}` : ''}`,
  method: fournisseur.id ? 'put' : 'post',
  datas: { ...fournisseur },
  msgPending: 'Sauvegarde en cours...',
  msgSuccess,
  redirectSuccess: '/',
});

/**
* query : { relaiId, jointures: true }
**/
export const loadOffres = query => ({
  type: findActionType('load_offres', c, 'START'),
  url: 'offre_produits',
  query,
});

export const updateCatalogue = relaiId => ({
  type: c.UPDATE_CATALOGUE_START,
  payload: { relaiId },
});

export const catalogueUpdated = (offres, fournisseurs) => ({
  type: c.UPDATE_CATALOGUE_SUCCESS,
  payload: { offres, fournisseurs },
});

export const supprimerCommandeContenusFournisseur = ({ fournisseurId, commandeId }) => ({
  type: findActionType('supprimer_commande_contenus_fournisseur', c, 'START'),
  url: `/commandes/${commandeId}/fournisseurs/${fournisseurId}`,
  method: 'del',
  datas: { fournisseurId, commandeId },
  msgPending: 'Suppression offres',
});

export const loadTypesProduits = query => ({
  type: findActionType('load_types_produits', c, 'START'),
  url: 'type_produits',
  query,
  msgPending: 'Chargement types produits',
});

export const loadRelais = query => ({
  type: findActionType('load_relais', c, 'START'),
  url: 'relais',
  query,
  msgPending: 'Chargement relais',
});

export const loadUtilisateurs = query => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  url: 'utilisateurs',
  query,
  msgPending: 'Chargement utilisateurs',
});

export const loadCommandeUtilisateurs = query => ({
  type: findActionType('load_commande_utilisateurs', c, 'START'),
  url: 'commande_utilisateurs',
  query,
});

export const fetchUtilisateurs = ids => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  method: 'post',
  url: 'utilisateurs/byIds',
  datas: { ids },
});

export const saveUtilisateur = utilisateur => ({
  type: findActionType('save_utilisateur', c, 'START'),
  url: `utilisateurs${utilisateur.id ? `/${utilisateur.id}` : ''}`,
  method: utilisateur.id ? 'put' : 'post',
  datas: { ...utilisateur },
});

export const loadUserCommandes = userId => ({
  type: findActionType('load_user_commandes', c, 'START'),
  url: `/utilisateurs/${userId}/commandes`,
  msgPending: 'Chargement commandes',
});

export const ajouter = (contenuId, qte) => ({
  type: c.AJOUTER,
  contenuId,
  quantite: qte,
});
