import { Record, List, Map } from 'immutable';

const Offre = new Record({
  id: null,
  produitId: null,
  prix: 0,
  recolteFond: 0,
  poids: 0,
  description: null,
  referenceFourn: null,

  tarifications: new List(),

  relaiId: null, // null => offre fournisseur
  idOffreOriginale: null,

  active: true,
  archive: false,
  quantiteParDefaut: 1,
  quantiteAjustable: false,
  stock: 0,

  qteMinTarif: 0, // quantite min commandee pour que le tarif soit appliqué
  infosSupplement: new Map(),
  colisageType: null, // 'poids' : 'qte'
  colisageQuantite: null,

  uniteId: null, // dépréciée
  createdAt: null,
});

export default Offre;
