import expect from 'expect';
import { fromJS, Map, List } from 'immutable';
import uuid from 'node-uuid';
import commandeReducer from '../reducer';

import {
  ajouter,
  ajouterOffre,
  diminuerOffre,
  setDistibution,
} from '../actions';

import c from '../constants';

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

  it("AJOUTER: La quantite d'une commande contenu existante est correctement incrémentée ", () => {
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

  it("AJOUTER_OFFRE: lors du premier ajout d'une offre, une nouvelle commandeUtilisateur est correctement créé", () => {
    const stateSansCommandeUtilisateur = state.setIn(
      ['datas', 'entities', 'commandeUtilisateurs'],
      fromJS({})
    );

    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const offreId = uuid.v4();

    const newOffre = {
      offreId,
      commandeId,
      utilisateurId,
      tarifications: [{ prix: 10, qteMinRelais: 0, recolteFond: 0.1 }],
    };

    const newState = commandeReducer(
      stateSansCommandeUtilisateur,
      ajouterOffre(newOffre)
    );

    expect(
      newState.getIn(['datas', 'entities', 'commandeUtilisateurs']).size
    ).toEqual(1);

    const commandeUtilisateurId = newState
      .getIn(['datas', 'entities', 'commandeUtilisateurs'])
      .findKey(
        item =>
          item.get('commandeId') === commandeId &&
          item.get('utilisateurId') === utilisateurId
      );

    // console.log(
    //   'ns',
    //   commandeUtilisateurId,
    //   newState.getIn(['datas', 'entities', 'commandeUtilisateurs']).toJS()
    // );
    const commandeContenuId = newState
      .getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'contenus',
      ])
      .get(0);
    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeContenus',
        commandeContenuId,
        'quantite',
      ])
    ).toEqual(1);
  });

  it("AJOUTER_OFFRE: lors du deuxième ajout d'une offre, commandeUtilisateurs et commandeContenus sont correctement mis à jour", () => {
    const commandeUtilisateurId = uuid.v4();
    const commandeContenuId = uuid.v4();
    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const offreId = uuid.v4();

    const stateAvecCommandeUtilisateur = state.setIn(
      ['datas', 'entities'],
      fromJS({
        commandeUtilisateurs: {
          [commandeUtilisateurId]: {
            commandeId,
            utilisateurId,
            contenus: [commandeContenuId],
          },
        },
        commandeContenus: {
          [commandeContenuId]: {
            commandeId,
            utilisateurId,
            offreId,
            quantite: 1,
          },
        },
      })
    );

    const newOffre = {
      offreId,
      commandeId,
      utilisateurId,
      tarifications: [{ prix: 10, qteMinRelais: 0, recolteFond: 0.1 }],
    };

    const newState = commandeReducer(
      stateAvecCommandeUtilisateur,
      ajouterOffre(newOffre)
    );

    expect(
      newState.getIn(['datas', 'entities', 'commandeUtilisateurs']).size
    ).toEqual(1);

    expect(
      newState.getIn(['datas', 'entities', 'commandeUtilisateurs']).size
    ).toEqual(1);

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'contenus',
      ]).size
    ).toEqual(1);

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeContenus',
        commandeContenuId,
        'quantite',
      ])
    ).toEqual(2);
  });

  it("DIMINUER_OFFRE: la quantite d'une offre est correctement décrémentée ", () => {
    const commandeUtilisateurId = uuid.v4();
    const commandeContenuId = uuid.v4();
    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const offreId = uuid.v4();

    const stateAvecCommandeUtilisateur = state.setIn(
      ['datas', 'entities'],
      fromJS({
        commandeUtilisateurs: {
          [commandeUtilisateurId]: {
            commandeId,
            utilisateurId,
            contenus: [commandeContenuId],
          },
        },
        commandeContenus: {
          [commandeContenuId]: {
            commandeId,
            utilisateurId,
            offreId,
            quantite: 5,
          },
        },
      })
    );

    const offre = {
      offreId,
      commandeId,
      utilisateurId,
    };

    const newState = commandeReducer(
      stateAvecCommandeUtilisateur,
      diminuerOffre(offre)
    );

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'updatedAt',
      ])
    ).toEqual(null);

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeContenus',
        commandeContenuId,
        'quantite',
      ])
    ).toEqual(4);
  });
  it("DIMINUER_OFFRE: quand la quantité de l'offre décrémentée = 0, le contenu est supprimé", () => {
    const commandeUtilisateurId = uuid.v4();
    const commandeContenuId = uuid.v4();
    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const offreId = uuid.v4();

    const stateAvecCommandeUtilisateur = state.setIn(
      ['datas', 'entities'],
      fromJS({
        commandeUtilisateurs: {
          [commandeUtilisateurId]: {
            commandeId,
            utilisateurId,
            contenus: [commandeContenuId],
          },
        },
        commandeContenus: {
          [commandeContenuId]: {
            commandeId,
            utilisateurId,
            offreId,
            quantite: 1,
          },
        },
      })
    );

    const offre = {
      offreId,
      commandeId,
      utilisateurId,
    };

    const newState = commandeReducer(
      stateAvecCommandeUtilisateur,
      diminuerOffre(offre)
    );

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'updatedAt',
      ])
    ).toEqual(null);

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeContenus',
        commandeContenuId,
      ])
    ).toEqual(undefined);
  });

  it('SET_DISTRIBUTION: la commandeUtilisateur est correctement mise à jour', () => {
    const commandeUtilisateurId = uuid.v4();
    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const livraisonId = uuid.v4();
    const plageHoraire = 60;

    const stateAvecCommandeUtilisateur = state.setIn(
      ['datas', 'entities'],
      fromJS({
        commandeUtilisateurs: {
          [commandeUtilisateurId]: {
            commandeId,
            utilisateurId,
            contenus: [],
            updatedAt: new Date(),
          },
        },
      })
    );

    const newState = commandeReducer(
      stateAvecCommandeUtilisateur,
      setDistibution({
        commandeId,
        utilisateurId,
        plageHoraire,
        livraisonId,
      })
    );
    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'updatedAt',
      ])
    ).toEqual(null);
    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
        'livraisonId',
      ])
    ).toEqual(livraisonId);
  });

  it("ASYNC_ANNULER_SUCCESS: quand la requête d'annulation est un succès, la commandeUtilisateur est bien annulée", () => {
    const commandeUtilisateurId = uuid.v4();
    const commandeContenuId = uuid.v4();
    const utilisateurId = uuid.v4();
    const commandeId = uuid.v4();
    const offreId = uuid.v4();

    const stateAvecCommandeUtilisateur = state.setIn(
      ['datas', 'entities'],
      fromJS({
        commandeUtilisateurs: {
          [commandeUtilisateurId]: {
            commandeId,
            utilisateurId,
            contenus: [commandeContenuId],
          },
          sdfjkjdsl: {
            commandeId,
            utilisateurId,
            contenus: ['azerty'],
          },
        },
        commandeContenus: {
          [commandeContenuId]: {
            commandeUtilisateurId,
            commandeId,
            utilisateurId,
            offreId,
            quantite: 1,
          },
          azerty: {
            commandeId,
            utilisateurId,
            offreId,
            quantite: 1,
          },
        },
        commandes: {
          [commandeId]: {
            dateCommande: new Date(),
            commandeUtilisateurs: [commandeUtilisateurId],
          },
        },
      })
    );

    const newState = commandeReducer(stateAvecCommandeUtilisateur, {
      type: c.ASYNC_ANNULER_SUCCESS,
      req: { datas: { commandeId, id: commandeUtilisateurId } },
    });

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandeUtilisateurs',
        commandeUtilisateurId,
      ])
    ).toEqual(undefined);

    expect(
      newState.getIn(['datas', 'entities', 'commandeUtilisateurs']).size
    ).toEqual(1);

    expect(
      newState.getIn(['datas', 'entities', 'commandeContenus']).size
    ).toEqual(1);

    expect(
      newState.getIn([
        'datas',
        'entities',
        'commandes',
        commandeId,
        'commandeUtilisateurs',
      ]).size
    ).toEqual(0);
  });
});
