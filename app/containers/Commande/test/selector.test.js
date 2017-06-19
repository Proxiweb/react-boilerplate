import { fromJS, Map, List } from 'immutable';
import expect from 'expect';
import {
  makeSelectDomain,
  makeSelectFournisseurs,
  makeSelectRelaisSelected,
  makeSelectFournisseur,
  makeSelectFournisseursRelais,
  makeSelectUserIdCommandes,
} from '../selectors';

const fixures = fromJS({
  datas: {
    entities: {
      commandes: {
        cde1: {
          id: 'cde1',
          datesLimites: [],
        },
        cde2: {
          id: 'cde2',
          datesLimites: [],
        },
      },
      commandeUtilisateurs: {
        cu1: {
          id: 'cu1',
          commandeId: 'cde1',
          utilisateurId: 'u1',
        },
        cu2: {
          id: 'cu2',
          commandeId: 'cde2',
          utilisateurId: 'u2',
        },
      },
      fournisseurs: {
        idvisible: {
          livraisonGlobale: false,
          visible: true,
          relais: [
            {
              actif: true,
              id: 'relais1',
            },
          ],
        },
        idnonvisible: {
          livraisonGlobale: false,
          visible: false,
          relais: [
            {
              actif: true,
              id: 'relais2',
            },
          ],
        },
        global: {
          livraisonGlobale: true,
          visible: true,
        },
      },
      relais: {
        relais1: {
          nom: 'Relais 1',
        },
        relais2: {
          nom: 'Relais 2',
        },
        relais3: {
          nom: 'Relais 3',
        },
      },
    },
  },
});

const mockedFixtures = fromJS({
  commandes: fixures,
});

describe('commande selectors', () => {
  it('makeSelectDomain sélectionne le global state de state.commande', () => {
    const selectDomain = makeSelectDomain();
    expect(Map.isMap(selectDomain(mockedFixtures))).toEqual(true);
  });

  it("makeSelectRelaisSelected sélectionne le relais relaiId présent dans l'url ", () => {
    const selectRelais = makeSelectRelaisSelected();
    const selection = selectRelais(mockedFixtures, {
      params: { relaiId: 'relais1' },
    });
    expect(selection.get('nom')).toEqual('Relais 1');
  });

  it('makeSelectFournisseurs sélectionne les uniquement les fournisseurs visibles', () => {
    const selectFournisseurs = makeSelectFournisseurs();
    const selection = selectFournisseurs(mockedFixtures);
    expect(selection.size).toEqual(2);
    expect(selection.getIn(['idvisible', 'visible'])).toEqual(true);
  });

  it("makeSelectFournisseur sélectionne fournisseurId présent dans l'url", () => {
    const selectFournisseur = makeSelectFournisseur();
    const selection = selectFournisseur(mockedFixtures, {
      params: { fournisseurId: 'idnonvisible' },
    });
    expect(selection.get('visible')).toEqual(false);
  });

  it("makeSelectFournisseursRelais sélectionne les fournisseurs du relaiId présent dans l'url", () => {
    const selectFournisseurRelais = makeSelectFournisseursRelais();
    const selection = selectFournisseurRelais(mockedFixtures, {
      params: { relaiId: 'relais1' },
    });
    expect(selection.size).toEqual(2);
  });

  it("makeSelectUserIdCommandes sélectionne les commandes de userId présent dans l'url", () => {
    const selectFournisseurRelais = makeSelectUserIdCommandes();
    const selection = selectFournisseurRelais(mockedFixtures, {
      params: { userId: 'u1' },
    });
    console.log(selection.toJS());
    expect(Map.isMap(selection)).toEqual(true);
    expect(selection.site).toEqual(1);
  });
});
