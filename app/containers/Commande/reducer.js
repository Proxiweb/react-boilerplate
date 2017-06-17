/*
 *
 * Commande reducer
 *
 */
import update from 'immutability-helper';
import { fromJS, Map, List } from 'immutable';

import c from './constants';
import cF from 'containers/AdminFournisseur/constants';
// import cE from 'containers/CommandeEdit/constants';
import { normalize, arrayOf } from 'normalizr';
import { schemas } from './schemas';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import uuid from 'node-uuid';

const nCommande = fromJS({
  dateLivraison: null,
  datePaiement: null,
  livraisonId: null,
  montant: 0,
  plageHoraire: 0,
  prestationRelai: 0,
  recolteFond: 0,
  createdAt: null,
  updatedAt: null,
  contenus: [],
  // commandeId: "eee9a49f-f3b7-493e-8c27-28956d8cd0a0"
  // utilisateurId: "3c3fff89-9604-4729-b794-69dd60005dfe"
});

const nCommandeContenu = fromJS({
  createdAt: null,
  updatedAt: null,
  qteRegul: 0,
  quantite: 0,
});

const initialState = fromJS({
  pending: false,
  datas: {
    entities: {},
    result: [],
  },
  error: null,
  cotisationId: '8b330a52-a605-4a67-aee7-3cb3c9274733',
});

const ajouter = (state, action) =>
  state.updateIn(
    ['datas', 'entities', 'commandeContenus', action.contenuId, 'quantite'],
    cont => cont + action.quantite
  );

// const annuleCommandeUtilisateur = (state, commandeUtilisateurId, cdeId) => {
//   const { commandeUtilisateurs, commandeContenus, commandes } = state.datas.entities;
//
//   const contenusRestants = Object.keys(commandeContenus)
//     .filter(id => commandeUtilisateurs[id] && !includes(commandeUtilisateurs[id].contenus, id))
//     .reduce((memo, id) => ({ [id]: commandeContenus[id] }), {});
//
//   const commandeUtilisateursRestants = Object.keys(commandeUtilisateurs)
//     .filter(id => id !== commandeUtilisateurId)
//     .reduce((memo, id) => ({ [id]: commandeUtilisateurs[id] }), {});
//
//   const commandeCommandeUtilisateursRestants = commandes[cdeId].commandeUtilisateurs.filter(
//     id => id !== commandeUtilisateurId
//   );
//
//   return update(state, {
//     datas: {
//       entities: {
//         commandeUtilisateurs: { $set: commandeUtilisateursRestants },
//         commandeContenus: { $set: contenusRestants },
//         commandes: {
//           [cdeId]: {
//             commandeUtilisateurs: {
//               $set: commandeCommandeUtilisateursRestants,
//             },
//           },
//         },
//       },
//     },
//   });
// };
//
// const supprimeCommandeContenusFournisseur = (state, fournisseurId, commandeId) => {
//   const { commandeContenus, offres, produits, commandeUtilisateurs } = state.datas.entities;
//
//   const commandeContenusASupprimerIds = Object.keys(commandeContenus).filter(
//     id =>
//       commandeContenus[id].commandeId === commandeId &&
//       produits[offres[commandeContenus[id].offreId].produitId].fournisseurId === fournisseurId
//   );
//
//   const commandeUtilisateursModifiee = uniq(
//     // il peut y a voir plusieurs contenus pour une meme commandeUtilisateur
//     commandeContenusASupprimerIds.map(ccId => commandeContenus[ccId].commandeUtilisateurId)
//   ).reduce(
//     (memo, cuId) => ({
//       ...memo,
//       [cuId]: {
//         ...commandeUtilisateurs[cuId],
//         contenus: commandeUtilisateurs[cuId].contenus.filter(
//           id => !includes(commandeContenusASupprimerIds, id)
//         ),
//       },
//     }),
//     {}
//   );
//
//   const commandeContenusModifiee = Object.keys(commandeContenus)
//     .filter(id => !includes(commandeContenusASupprimerIds, id))
//     .reduce(
//       (memo, id) => ({
//         ...memo,
//         [id]: commandeContenus[id],
//       }),
//       {}
//     );
//
//   return update(state, {
//     datas: {
//       entities: {
//         commandeContenus: {
//           $set: { ...commandeContenus, ...commandeContenusModifiee },
//         },
//         commandeUtilisateurs: {
//           $set: { ...commandeUtilisateurs, ...commandeUtilisateursModifiee },
//         },
//       },
//     },
//   });
// };
//
// const supprimeContenu = (state, contenu) => {
//   const { commandeUtilisateurs, commandeContenus } = state.datas.entities;
//   const contenusRestants = commandeUtilisateurs[contenu.commandeUtilisateurId].contenus.filter(
//     cont => cont !== contenu.id
//   ); // eslint-disable-line
//   const commandeContenusRestants = Object.keys(commandeContenus).reduce((memo, cont) => {
//     const aIns = cont.id !== contenu.id ? { [contenu.id]: contenu } : {};
//     return { ...memo, aIns };
//   }, {});
//   return update(state, {
//     datas: {
//       entities: {
//         commandeUtilisateurs: {
//           [contenu.commandeUtilisateurId]: {
//             contenus: { $set: contenusRestants },
//           },
//           commandeContenus: { $set: commandeContenusRestants },
//         },
//       },
//     },
//   });
// };

function commandeReducer(state = initialState, action) {
  switch (action.type) {
    // case c.ASYNC_LOAD_FOURNISSEURS_SUCCESS: {
    //   const datas = normalize(action.datas.fournisseurs, arrayOf(schemas.FOURNISSEURS));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //       result: { $push: datas.result },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    // case c.ASYNC_LOAD_OFFRES_SUCCESS: {
    //   const datas = normalize(action.datas.offre_produits, arrayOf(schemas.OFFRES));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //       result: { $push: datas.result },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    // case c.ASYNC_LOAD_USER_COMMANDES_SUCCESS:
    // case c.ASYNC_LOAD_COMMANDES_SUCCESS: {
    //   const datas = normalize(action.datas.commandes, arrayOf(schemas.COMMANDES));
    //   const defaults = {
    //     commandes: {},
    //     commandeContenus: {},
    //     commandeUtilisateurs: {},
    //     fournisseurs: {},
    //   };
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         $set: merge(state.datas.entities, assign(defaults, datas.entities)),
    //       },
    //       result: { $push: datas.result },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    // // case cE.ASYNC_SAUVEGARDER_SUCCESS: {
    // //   const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
    // //   return update(state, {
    // //     datas: {
    // //       entities: { $set: merge(state.datas.entities, datas.entities) },
    // //       result: { $push: [datas.result] },
    // //     },
    // //     pending: { $set: false },
    // //   });
    // // }
    //
    case c.ASYNC_ANNULER_SUCCESS: {
      const { commandeId, id } = action.req.datas;
      return state
        .updateIn(['datas', 'entities', 'commandeUtilisateurs'], cU =>
          cU.delete(id)
        )
        .updateIn(['datas', 'entities', 'commandeContenus'], cCs =>
          cCs.filter(cC => cC.get('commandeUtilisateurId') !== id)
        )
        .updateIn(
        [
          'datas',
          'entities',
          'commandes',
          commandeId,
          'commandeUtilisateurs',
        ],
          cUs => cUs.filter(cuId => cuId !== id)
        );

      // return annuleCommandeUtilisateur(state, id, commandeId);
      // const annuleCommandeUtilisateur = (state, commandeUtilisateurId, cdeId) => {
      //   const { commandeUtilisateurs, commandeContenus, commandes } = state.datas.entities;
      //
      //   const contenusRestants = Object.keys(commandeContenus)
      //     .filter(id => commandeUtilisateurs[id] && !includes(commandeUtilisateurs[id].contenus, id))
      //     .reduce((memo, id) => ({ [id]: commandeContenus[id] }), {});
      //
      //   const commandeUtilisateursRestants = Object.keys(commandeUtilisateurs)
      //     .filter(id => id !== commandeUtilisateurId)
      //     .reduce((memo, id) => ({ [id]: commandeUtilisateurs[id] }), {});
      //
      //   const commandeCommandeUtilisateursRestants = commandes[cdeId].commandeUtilisateurs.filter(
      //     id => id !== commandeUtilisateurId
      //   );
      //
      //   return update(state, {
      //     datas: {
      //       entities: {
      //         commandeUtilisateurs: { $set: commandeUtilisateursRestants },
      //         commandeContenus: { $set: contenusRestants },
      //         commandes: {
      //           [cdeId]: {
      //             commandeUtilisateurs: {
      //               $set: commandeCommandeUtilisateursRestants,
      //             },
      //           },
      //         },
      //       },
      //     },
      //   });
      // };
    }
    //
    // case c.ASYNC_CREATE_COMMANDE_SUCCESS:
    // case c.ASYNC_LOAD_COMMANDE_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.COMMANDES);
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //       result: { $push: [datas.result] },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_DELETE_COMMANDE_SUCCESS: {
    //   const { id } = action.req.datas;
    //   const { commandes } = state.datas.entities;
    //   const commandesRestantes = Object.keys(commandes).reduce(
    //     (memo, key) => (key !== id ? { ...memo, [key]: commandes[key] } : memo),
    //     {}
    //   );
    //
    //   return update(state, {
    //     datas: { entities: { commandes: { $set: commandesRestantes } } },
    //   });
    // }
    //
    // case c.ASYNC_LOAD_RELAIS_SUCCESS: {
    //   const datas = normalize(action.datas.relais, arrayOf(schemas.RELAIS));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_SAVE_PRODUIT_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.PRODUITS);
    //
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         produits: {
    //           [action.datas.id]: {
    //             $set: datas.entities.produits[action.datas.id],
    //           },
    //         },
    //         pending: { $set: false },
    //       },
    //     },
    //   });
    // }
    //
    // case c.ASYNC_SAVE_OFFRE_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.OFFRES);
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         offres: {
    //           [action.datas.id]: {
    //             $set: datas.entities.offres[action.datas.id],
    //           },
    //         },
    //         pending: { $set: false },
    //       },
    //     },
    //   });
    // }
    //
    // case c.ASYNC_DELETE_OFFRE_SUCCESS: {
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         offres: {
    //           $set: Object.keys(state.datas.entities.offres).reduce(
    //             (m, id) =>
    //               id !== action.req.id ? { ...m, [id]: state.datas.entities.offres[id] } : { ...m },
    //             {}
    //           ),
    //         },
    //         pending: { $set: false },
    //       },
    //     },
    //   });
    // }
    //
    // case c.ASYNC_IMPORTE_OFFRES_SUCCESS: {
    //   const datas = normalize(action.datas.offres, schemas.OFFRES);
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_LOAD_TYPES_PRODUITS_SUCCESS: {
    //   const datas = normalize(action.datas.type_produits, arrayOf(schemas.TYPES_PRODUITS));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_LOAD_FOURNISSEUR_SUCCESS:
    // case cF.ASYNC_LOAD_FOURNISSEUR_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.FOURNISSEURS);
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_MODIFIER_COMMANDE_CONTENU_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.COMMANDE_CONTENUS);
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeContenus: {
    //           [action.datas.id]: {
    //             $set: datas.entities.commandeContenus[action.datas.id],
    //           },
    //         },
    //       },
    //     },
    //   });
    // }
    //
    // case c.ASYNC_SUPPRIMER_COMMANDE_CONTENUS_FOURNISSEUR_SUCCESS: {
    //   const { fournisseurId, commandeId } = action.req.datas;
    //   return supprimeCommandeContenusFournisseur(state, fournisseurId, commandeId);
    // }
    //
    // case c.ASYNC_PAYE_COMMANDE_UTILISATEUR_SUCCESS:
    // case c.ASYNC_LIVRE_COMMANDE_UTILISATEUR_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeUtilisateurs: {
    //           [action.datas.id]: {
    //             $set: datas.entities.commandeUtilisateurs[action.datas.id],
    //           },
    //         },
    //       },
    //     },
    //   });
    // }
    //
    case c.AJOUTER:
      return ajouter(state, action);
    // case c.NOUVEL_ACHAT: {
    //   const nCommandeContenus = {
    //     ...state.datas.entities.commandeContenus,
    //     [action.datas.id]: action.datas,
    //   };
    //   return update(state, {
    //     datas: { entities: { commandeContenus: { $set: nCommandeContenus } } },
    //   });
    // }
    // case c.SUPPRESSION_ACHAT: {
    //   const nCommandeContenus = omit(state.datas.entities.commandeContenus, action.datas.id);
    //   return update(state, {
    //     datas: { entities: { commandeContenus: { $set: nCommandeContenus } } },
    //   });
    // }
    // case c.MODIF_ACHAT: {
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeContenus: {
    //           $set: {
    //             ...state.datas.entities.commandeContenus,
    //             [action.datas.id]: action.datas,
    //           },
    //         },
    //       },
    //     },
    //   });
    // }
    //
    // case c.ASYNC_SUPPRIMER_COMMANDE_CONTENU_SUCCESS:
    //   return supprimeContenu(state, action.req.datas);
    //
    // case c.ASYNC_LOAD_UTILISATEURS_SUCCESS: {
    //   const datas = normalize(action.datas.utilisateurs, arrayOf(schemas.UTILISATEURS));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_LOAD_COMMANDE_UTILISATEURS_SUCCESS: {
    //   const datas = normalize(action.datas.commande_utilisateurs, arrayOf(schemas.COMMANDE_UTILISATEURS));
    //   return update(state, {
    //     datas: {
    //       entities: { $set: merge(state.datas.entities, datas.entities) },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case c.ASYNC_SAVE_UTILISATEUR_SUCCESS: {
    //   const datas = normalize(action.datas, schemas.UTILISATEURS);
    //
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         utilisateurs: {
    //           [action.datas.id]: {
    //             $set: datas.entities.utilisateurs[action.datas.id],
    //           },
    //         },
    //         pending: { $set: false },
    //       },
    //     },
    //   });
    // }
    //
    // case c.INIT_COMMANDE: {
    //   const { commandeId, utilisateurId } = action.payload;
    //   const id = uuid.v4();
    //   const nouvelleCommande = { ...nCommande, id, commandeId, utilisateurId };
    //   const nCommandeUtilisateurs = {
    //     ...state.datas.entities.commandeUtilisateurs,
    //     [id]: nouvelleCommande,
    //   };
    //   return update(state, {
    //     datas: {
    //       entities: { commandeUtilisateurs: { $set: nCommandeUtilisateurs } },
    //     },
    //   });
    // }
    //
    case c.AJOUTER_OFFRE: {
      const { offreId, utilisateurId, commandeId } = action.payload;
      const commandeUtilisateurId = state
        .getIn(['datas', 'entities', 'commandeUtilisateurs'])
        .findKey(
          item =>
            item.get('utilisateurId') === utilisateurId &&
            item.get('commandeId') === commandeId
        );
      const commandeContenuId = commandeUtilisateurId
        ? state
            .getIn(['datas', 'entities', 'commandeContenus'])
            .findKey(
              item =>
                item.get('utilisateurId') === utilisateurId &&
                item.get('commandeId') === commandeId &&
                item.get('offreId') === offreId
            )
        : undefined;

      const nCommandeContenuId = uuid.v4();

      const quantiteContenuActuelle = commandeContenuId
        ? state.getIn([
          'datas',
          'entities',
          'commandeContenus',
          commandeContenuId,
          'quantite',
        ])
        : 0;
      const id = uuid.v4();

      const stateAvecNouveauContenu = commandeContenuId
        ? state.setIn(
          [
            'datas',
            'entities',
            'commandeContenus',
            commandeContenuId,
            'quantite',
          ],
            quantiteContenuActuelle + 1
          )
        : state.setIn(
            ['datas', 'entities', 'commandeContenus', nCommandeContenuId],
            fromJS({
              ...nCommandeContenu,
              quantite: 1,
              commandeUtilisateurId: commandeUtilisateurId || id,
              commandeId,
              utilisateurId,
              offreId,
            })
          );

      let rState;
      if (!commandeUtilisateurId) {
        rState = stateAvecNouveauContenu.setIn(
          ['datas', 'entities', 'commandeUtilisateurs', id],
          nCommande.merge({
            contenus: [nCommandeContenuId],
            commandeId,
            utilisateurId,
          })
        );
      } else {
        rState = stateAvecNouveauContenu.setIn(
          [
            'datas',
            'entities',
            'commandeUtilisateurs',
            commandeUtilisateurId,
            'updatedAt',
          ],
          null
        );
      }
      return rState;
    }
    //
    case c.DIMINUER_OFFRE: {
      const { offreId, commandeId, utilisateurId } = action.payload;
      const commandeContenuId = state
        .getIn(['datas', 'entities', 'commandeContenus'])
        .findKey(
          item =>
            item.get('utilisateurId') === utilisateurId &&
            item.get('commandeId') === commandeId &&
            item.get('offreId') === offreId
        );
      const nouvelleQuantite =
        state.getIn([
          'datas',
          'entities',
          'commandeContenus',
          commandeContenuId,
          'quantite',
        ]) - 1;
      const commandeUtilisateurId = state
        .getIn(['datas', 'entities', 'commandeUtilisateurs'])
        .findKey(
          item =>
            item.get('utilisateurId') === utilisateurId &&
            item.get('commandeId') === commandeId
        );

      if (nouvelleQuantite === 0) {
        return state
          .updateIn(['datas', 'entities', 'commandeContenus'], cont =>
            cont.delete(commandeContenuId)
          )
          .setIn(
          [
            'datas',
            'entities',
            'commandeUtilisateurs',
            commandeUtilisateurId,
            'updatedAt',
          ],
            null
          )
          .updateIn(
          [
            'datas',
            'entities',
            'commandeUtilisateurs',
            commandeUtilisateurId,
            'contenus',
          ],
            contenus => contenus.filter(id => id !== commandeContenuId)
          );
      }

      return state
        .setIn(
        [
          'datas',
          'entities',
          'commandeContenus',
          commandeContenuId,
          'quantite',
        ],
          nouvelleQuantite
        )
        .setIn(
        [
          'datas',
          'entities',
          'commandeUtilisateurs',
          commandeUtilisateurId,
          'updatedAt',
        ],
          null
        );
    }

    case c.SET_DISTRIBUTION: {
      const {
        commandeId,
        utilisateurId,
        plageHoraire,
        livraisonId,
      } = action.payload;

      const commandeUtilisateurId = state
        .getIn(['datas', 'entities', 'commandeUtilisateurs'])
        .findKey(
          item =>
            item.get('utilisateurId') === utilisateurId &&
            item.get('commandeId') === commandeId
        );

      return state.updateIn(
        ['datas', 'entities', 'commandeUtilisateurs', commandeUtilisateurId],
        cu =>
          cu.merge({
            livraisonId,
            plageHoraire,
            updatedAt: null,
          })
      );
    }
    //
    // case 'ws/NOUVELLE_COMMANDE_UTILISATEUR': {
    //   const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
    //   const stateContenus = state.datas.entities.commandeContenus;
    //   Object.keys(datas.entities.commandeContenus).forEach(
    //     id => (stateContenus[id] = datas.entities.commandeContenus[id])
    //   );
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeUtilisateurs: {
    //           [action.datas.id]: {
    //             $set: datas.entities.commandeUtilisateurs[action.datas.id],
    //           },
    //         },
    //         commandeContenus: {
    //           $set: stateContenus,
    //         },
    //       },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case 'ws/MODIF_COMMANDE_UTILISATEUR': {
    //   const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
    //   const stateContenus = state.datas.entities.commandeContenus;
    //   Object.keys(datas.entities.commandeContenus).forEach(
    //     id => (stateContenus[id] = datas.entities.commandeContenus[id])
    //   );
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeUtilisateurs: {
    //           [action.datas.id]: {
    //             $set: datas.entities.commandeUtilisateurs[action.datas.id],
    //           },
    //         },
    //         commandeContenus: {
    //           $set: stateContenus,
    //         },
    //       },
    //     },
    //     pending: { $set: false },
    //   });
    // }
    //
    // case 'ws/SUPPRESSION_ACHAT':
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         commandeContenus: {
    //           $set: Object.keys(state.datas.entities.commandeContenus).reduce(
    //             (m, id) =>
    //               id === action.datas.id
    //                 ? m
    //                 : {
    //                     ...m,
    //                     [id]: state.datas.entities.commandeContenus[id],
    //                   },
    //             {}
    //           ),
    //         },
    //       },
    //     },
    //   });
    //
    // case 'ws/OFFRE_MODIF_STOCK':
    //   return update(state, {
    //     datas: {
    //       entities: {
    //         offres: {
    //           [action.datas.id]: { stock: { $set: action.datas.stock } },
    //         },
    //       },
    //     },
    //   });
    default:
      return state;
  }
}

export default commandeReducer;
