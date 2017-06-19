import { Record, List, Map } from 'immutable';

const Relais = new Record({
  id: null,
  nom: null,
  type: 'primaire',
  adresse: null,
  adresseComplementaire: null,
  codePostal: null,
  ville: null,
  position: null,
  note: null,
  coutPrestation: 10,
  relaiPrimaireId: null,
  createdAt: new Date(),
  stellarKeys: new Map(),
  distributionJours: new List(),
  presentation: '<p>Présentation du Relais</p>',
  rangeDistribMinutes: 60,
  fournisseursHebdo: new List(),
  commandesAutomatiques: new List(),
});

export default Relais;
