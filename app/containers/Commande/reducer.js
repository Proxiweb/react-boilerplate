/*
 *
 * Commande reducer
 *
 */
import update from 'react-addons-update';
import c from './constants';
import { normalize, arrayOf } from 'normalizr';
import { schemas } from './schemas';
import merge from 'lodash.merge';

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

function commandeReducer(state = initialState, action) {
  switch (action.type) {
    case c.ASYNC_LOAD_COMMANDES_START:
      return update(state, { pending: { $set: true } });
    case c.ASYNC_LOAD_COMMANDES_SUCCESS: {
      const datas = normalize(action.datas.commandes, arrayOf(schemas.COMMANDE));
      return update(state, { datas: { entities: { $set: merge(state.datas.entities, datas.entities) }, result: { $push: datas.result } }, pending: { $set: false } });
    }
    case c.AJOUTER:
      return ajouter(state, action);
    default:
      return state;
  }
}

export default commandeReducer;