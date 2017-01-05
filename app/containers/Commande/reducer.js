/*
 *
 * Commande reducer
 *
 */
import update from 'react-addons-update';
import c from './constants';
import cF from 'containers/AdminFournisseur/constants';
import { normalize, arrayOf } from 'normalizr';
import { schemas } from './schemas';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  pending: false,
  datas: {
    entities: {},
    result: [],
  },
  error: null,
};

const ajouter = (state, action) => {
  const contenu = state.datas.entities.commandeContenu[action.contenuId];

  return update(state, {
    datas: {
      entities: {
        commandeContenu: {
          [action.contenuId]:
          { quantite:
            { $set: contenu.quantite + action.quantite },
          },
        },
      },
    },
  });
};

const majNouvelAchat = (state, commandeContenu) => {
  const majCu = update(
    state,
    { datas:
      { entities:
        { commandeUtilisateurs:
          { [commandeContenu.commandeUtilisateurId]:
            { contenus: { $push: [commandeContenu] },
          },
        },
      },
    },
    },
  );
  // const produit = state.datas.entities.produits[state.datas.entities.offres[commandeContenu.offreId].produitId];
  // const nStock = produit.stock - commandeContenu.quantite;
  // return update(majCu, { datas: { entities: { produits: { [produit.id]: { stock: { $set: nStock } } } } } });
  return majCu;
};

function commandeReducer(state = initialState, action) {
  switch (action.type) {
    case c.ASYNC_LOAD_COMMANDES_START:
      return update(state, { pending: { $set: true } });
    case c.ASYNC_LOAD_FOURNISSEURS_SUCCESS: {
      const datas = normalize(action.datas.fournisseurs, arrayOf(schemas.FOURNISSEURS));
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) }, result: { $push: datas.result } }, pending: { $set: false } });
    }
    case c.ASYNC_LOAD_USER_COMMANDES_SUCCESS:
    case c.ASYNC_LOAD_COMMANDES_SUCCESS: {
      const datas = normalize(action.datas.commandes, arrayOf(schemas.COMMANDES));
      const defaults = {
        commandes: {},
        commandeContenus: {},
        commandeUtilisateurs: {},
        livraisons: {},
        fournisseurs: {},
      };
      return update(state, { datas: { entities: { $set: assign(defaults, datas.entities) }, result: { $push: datas.result } }, pending: { $set: false } });
    }
    case c.ASYNC_CREATE_COMMANDE_SUCCESS:
    case c.ASYNC_LOAD_COMMANDE_SUCCESS: {
      const datas = normalize(action.datas, schemas.COMMANDES);
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) }, result: { $push: [datas.result] } }, pending: { $set: false } });
    }
    case c.ASYNC_LOAD_RELAIS_SUCCESS: {
      const datas = normalize(action.datas.relais, arrayOf(schemas.RELAIS));
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) } }, pending: { $set: false } });
    }

    case cF.ASYNC_LOAD_FOURNISSEUR_SUCCESS: {
      const datas = normalize(action.datas, schemas.FOURNISSEURS);
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) } }, pending: { $set: false } });
    }


    case c.AJOUTER:
      return ajouter(state, action);
    case c.NOUVEL_ACHAT: {
      const nCommandeContenus = { ...state.datas.entities.commandeContenus, [action.datas.id]: action.datas };
      return update(state, {
        datas: { entities: { commandeContenus: { $set: nCommandeContenus } } },
      });
    }
    case c.SUPPRESSION_ACHAT: {
      const nCommandeContenus = omit(state.datas.entities.commandeContenus, action.datas.id);
      return update(state, {
        datas: { entities: { commandeContenus: { $set: nCommandeContenus } } },
      });
    }
    case c.MODIF_ACHAT: {
      return update(state, {
        datas: { entities: { commandeContenus: { $set: { ...state.datas.entities.commandeContenus, [action.datas.id]: action.datas } } } },
      });
    }

    case c.ASYNC_LOAD_UTILISATEURS_SUCCESS: {
      const datas = normalize(action.datas.utilisateurs, arrayOf(schemas.UTILISATEURS));
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) } }, pending: { $set: false } });
    }

    case 'ws/NOUVELLE_COMMANDE_UTILISATEUR': {
      const nCu = action.datas;
      nCu.contenus = [];
      return update(state, {
        datas: {
          entities: { commandeUtilisateurs: { [nCu.id]: { $set: nCu } } },
        },
      });
    }

    case 'ws/NOUVEL_ACHAT': // websocket
      return majNouvelAchat(state, action.datas);
    case 'ws/OFFRE_MODIF_STOCK':
      return update(state, { datas: { entities: { offres: { [action.datas.id]: { stock: { $set: action.datas.stock } } } } } });
    case REHYDRATE: {
      const incoming = action.payload.commande;
      return { ...state, ...incoming };
    }
    default:
      return state;
  }
}

export default commandeReducer;
