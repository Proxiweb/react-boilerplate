import expect from 'expect';
import { fromJS, Map, List } from 'immutable';
import uuid from 'node-uuid';
import commandeReducer from '../reducer';

import { ajouter } from '../actions';

describe('commandeReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      pending: false,
      datas: {
        entities: {},
        result: [],
      },
      error: null,
      cotisationId: '8b330a52-a605-4a67-aee7-3cb3c9274733',
    });
  });

  it("devrait augmenter la quantite d'une commande contenu existante", () => {
    const id = uuid.v4();
    const stateAvecCde = state.setIn(
      ['datas', 'entities', 'commandeContenus'],
      fromJS({
        [id]: {
          createdAt: null,
          updatedAt: null,
          qteRegul: 0,
          quantite: 4,
        },
      })
    );

    const expectedResult = state.setIn(
      ['datas', 'entities', 'commandeContenus'],
      fromJS({
        [id]: {
          createdAt: null,
          updatedAt: null,
          qteRegul: 0,
          quantite: 6,
        },
      })
    );

    expect(commandeReducer(stateAvecCde, ajouter(id, 2))).toEqual(
      expectedResult
    );
  });

  it("lors du premier ajout d'une offre, une nouvelle commandeUtilisateur est créé, et l'offre est ajoutée", () => {});
});
