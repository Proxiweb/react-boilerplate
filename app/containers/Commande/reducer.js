/*
 *
 * Commande reducer
 *
 */
import update from 'immutability-helper';
import { fromJS, Map, List, Record } from 'immutable';

import c from './constants';
import cF from 'containers/AdminFournisseur/constants';
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

const initialState = new Record({
  pending: false,
  datas: {
    entities: {
      commandes: new Map(),
      utilisateurs: new Map(),
      commandeUtilisateurs: new Map(),
      commandeContenus: new Map(),
      commandes: new Map(),
      produits: new Map(),
      offres: new Map(),
      relais: new Map(),
    },
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

function commandeReducer(state = initialState, action) {
  switch (action.type) {
    case c.ASYNC_LOAD_FOURNISSEURS_SUCCESS: {
      const datas = normalize(
        action.datas.fournisseurs,
        arrayOf(schemas.FOURNISSEURS)
      );
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }
    case c.ASYNC_LOAD_OFFRES_SUCCESS: {
      const datas = normalize(
        action.datas.offre_produits,
        arrayOf(schemas.OFFRES)
      );
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }
    case c.ASYNC_LOAD_USER_COMMANDES_SUCCESS:
    case c.ASYNC_LOAD_COMMANDES_SUCCESS: {
      const datas = normalize(
        action.datas.commandes,
        arrayOf(schemas.COMMANDES)
      );
      const defaults = {
        commandes: {},
        commandeContenus: {},
        commandeUtilisateurs: {},
        fournisseurs: {},
      };
      return (
        state
          .updateIn(['datas', 'entities'], ents =>
            ents.merge([datas.entities, defaults])
          )
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

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
    }

    case c.ASYNC_CREATE_COMMANDE_SUCCESS:
    case c.ASYNC_LOAD_COMMANDE_SUCCESS: {
      const datas = normalize(action.datas, schemas.COMMANDES);
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_DELETE_COMMANDE_SUCCESS:
      return state.updateIn(['datas', 'entities', 'commandes'], cdes =>
        cdes.delete(action.req.datas.id)
      );

    case c.ASYNC_LOAD_RELAIS_SUCCESS: {
      const datas = normalize(action.datas.relais, arrayOf(schemas.RELAIS));
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_SAVE_PRODUIT_SUCCESS: {
      const datas = normalize(action.datas, schemas.PRODUITS);
      return state
        .setIn(
          ['datas', 'entities', 'produits', action.datas.id],
          datas.entities.produits[action.datas.id]
        )
        .setIn(['datas', 'pending'], false);
    }

    case c.ASYNC_SAVE_OFFRE_SUCCESS: {
      const datas = normalize(action.datas, schemas.OFFRES);
      return state
        .setIn(
          ['datas', 'entities', 'offres', action.datas.id],
          datas.entities.offres[action.datas.id]
        )
        .setIn(['datas', 'pending'], false);
    }

    case c.ASYNC_DELETE_OFFRE_SUCCESS: {
      return state.updateIn(['datas', 'entities', 'offres'], offres =>
        offres.delete(action.req.id)
      );
    }

    case c.ASYNC_IMPORTE_OFFRES_SUCCESS: {
      const datas = normalize(action.datas.offres, schemas.OFFRES);
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_LOAD_TYPES_PRODUITS_SUCCESS: {
      const datas = normalize(
        action.datas.type_produits,
        arrayOf(schemas.TYPES_PRODUITS)
      );
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }
    //
    case c.ASYNC_LOAD_FOURNISSEUR_SUCCESS:
    case cF.ASYNC_LOAD_FOURNISSEUR_SUCCESS: {
      const datas = normalize(action.datas, schemas.FOURNISSEURS);
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_MODIFIER_COMMANDE_CONTENU_SUCCESS: {
      const datas = normalize(action.datas, schemas.COMMANDE_CONTENUS);
      return state
        .setIn(
          ['datas', 'entities', 'commandeContenus', action.datas.id],
          datas.entities.commandeContenus[action.datas.id]
        )
        .setIn(['datas', 'pending'], false);
    }

    case c.ASYNC_PAYE_COMMANDE_UTILISATEUR_SUCCESS:
    case c.ASYNC_LIVRE_COMMANDE_UTILISATEUR_SUCCESS: {
      const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
      return state
        .setIn(
          ['datas', 'entities', 'commandeUtilisateurs', action.datas.id],
          datas.entities.commandeUtilisateurs[action.datas.id]
        )
        .setIn(['datas', 'pending'], false);
    }

    case c.AJOUTER:
      return ajouter(state, action);
    case c.MODIF_ACHAT:
    case c.NOUVEL_ACHAT:
      return state.setIn(
        ['datas', 'entities', 'commandeContenus', action.datas.id],
        action.datas
      );

    case c.SUPPRESSION_ACHAT:
      return state.updateIn(
        ['datas', 'entities', 'commandeContenus'],
        contenus => contenus.delete(action.datas.id)
      );

    case c.ASYNC_SUPPRIMER_COMMANDE_CONTENU_SUCCESS:
      return state
        .updateIn(['state', 'entities', 'commandeContenus'], contenus =>
          contenus.filter(c => c.get('id') === action.req.datas.id)
        )
        .updateIn(
          ['state', 'entities', 'commandeUtilisateurs', 'contenus'],
          contenus => contenus.delete(action.req.datas.id)
        );

    case c.ASYNC_LOAD_UTILISATEURS_SUCCESS: {
      const datas = normalize(
        action.datas.utilisateurs,
        arrayOf(schemas.UTILISATEURS)
      );
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_LOAD_COMMANDE_UTILISATEURS_SUCCESS: {
      const datas = normalize(
        action.datas.commande_utilisateurs,
        arrayOf(schemas.COMMANDE_UTILISATEURS)
      );
      return (
        state
          .updateIn(['datas', 'entities'], ents => ents.merge(datas.entities))
          // .updateIn(['datas', 'result'], res => res.push(datas.result))
          .set('pending', false)
      );
    }

    case c.ASYNC_SAVE_UTILISATEUR_SUCCESS: {
      const datas = normalize(action.datas, schemas.UTILISATEURS);
      return state
        .setIn(
          ['datas', 'entities', 'utilisateurs', action.datas.id],
          datas.entities.utilisateurs[action.datas.id]
        )
        .setIn(['datas', 'pending'], false);
    }

    case c.INIT_COMMANDE: {
      const { commandeId, utilisateurId } = action.payload;
      const id = uuid.v4();
      return state.updateIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        id,
        fromJS({ ...nCommande, id, commandeId, utilisateurId }),
      ]);
    }

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

    // @TODO a tester !
    case 'ws/MODIF_COMMANDE_UTILISATEUR':
    case 'ws/NOUVELLE_COMMANDE_UTILISATEUR': {
      const datas = normalize(action.datas, schemas.COMMANDE_UTILISATEURS);
      return state
        .setIn(
          ['datas', 'entities', 'commandeUtilisateurs', action.datas.id],
          datas.entities.commandeUtilisateurs[action.datas.id]
        )
        .updateIn(['datas', 'entities', 'commandeContenus'], contenus =>
          contenus.merge(state.datas.entities.commandeContenus)
        );
    }

    case 'ws/SUPPRESSION_ACHAT':
      return state.updateIn(
        ['datas', 'entities', 'commandeContenus'],
        commandeContenus => commandeContenus.delete(action.datas.id)
      );

    case 'ws/OFFRE_MODIF_STOCK':
      return state.updateIn(
        ['datas', 'entities', 'offres', action.datas, 'stock'],
        action.datas.stock
      );

    default:
      return state;
  }
}

export default commandeReducer;
