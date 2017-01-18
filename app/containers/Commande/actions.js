/*
 *
 * Commande actions
 *
 */
import { findActionType } from 'utils/asyncSagaConstants';
import c from './constants';

export const loadCommandes = (query) => ({
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

export const createCommande = (commande) => ({
  type: findActionType('create_commande', c, 'START'),
  url: `commandes${commande.id ? `/${commande.id}` : ''}`,
  method: (commande.id ? 'put' : 'post'),
  datas: { ...commande },
  msgPending: 'Création commande',
});

export const saveProduit = (produit, msgSuccess: 'Produit sauvegardé') => ({
  type: findActionType('save_produit', c, 'START'),
  url: `produits${produit.id ? `/${produit.id}` : ''}`,
  method: (produit.id ? 'put' : 'post'),
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
  method: (offre.id ? 'put' : 'post'),
  datas: { ...offre },
  msgPending: 'Sauvegarde en cours...',
  msgSuccess,
});

export const loadFournisseurs = (query) => ({
  type: findActionType('load_fournisseurs', c, 'START'),
  url: 'fournisseurs',
  query,
  msgPending: 'Chargement fournisseurs',
});

export const loadTypesProduits = (query) => ({
  type: findActionType('load_types_produits', c, 'START'),
  url: 'type_produits',
  query,
  msgPending: 'Chargement types produits',
});

export const loadRelais = (query) => ({
  type: findActionType('load_relais', c, 'START'),
  url: 'relais',
  query,
  msgPending: 'Chargement relais',
});

export const loadUtilisateurs = (query) => ({
  type: findActionType('load_utilisateurs', c, 'START'),
  url: 'utilisateurs',
  query,
  msgPending: 'Chargement utilisateurs',
});


export const loadUserCommandes = (userId) => ({
  type: findActionType('load_user_commandes', c, 'START'),
  url: `/utilisateurs/${userId}/commandes`,
  msgPending: 'Chargement commandes',
});

export const ajouter = (contenuId, qte) => ({
  type: c.AJOUTER,
  contenuId,
  quantite: qte,
});
