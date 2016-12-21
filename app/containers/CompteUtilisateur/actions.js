
import {
  saveAccountConst,
  progVirConst,
  loadVirConst,
  supprVirConst,
  depotCbConst,
  LOAD_ACCOUNT,
  LOAD_ACCOUNT_ERROR,
  LOAD_ACCOUNT_SUCCESS,
} from './constants';

export const loadAccount = (accountId) => ({
  type: LOAD_ACCOUNT,
  payload: {
    accountId,
  },
});

export const loadAccountError = (err) => ({
  type: LOAD_ACCOUNT_ERROR,
  payload: {
    err,
  },
});

export const accountLoaded = (account) => ({
  type: LOAD_ACCOUNT_SUCCESS,
  payload: {
    account,
  },
});

export const saveAccount =
  (
    utilisateurId,
    { nom, prenom, adresse, adresseComplementaire, codePostal, ville, telPortable, telFixe, email, pseudo, notifications, relaiId },
    msgSuccess = 'Profile sauvegardé',
    redirectSuccess = null,
  ) => ({
    type: saveAccountConst.ASYNC_SAVE_ACCOUNT_START,
    url: `utilisateurs/${utilisateurId}`,
    method: 'put',
    datas: { nom, prenom, adresse, adresseComplementaire, codePostal, ville, telPortable, telFixe, email, pseudo, notifications, relaiId },
    msgSuccess,
    redirectSuccess,
  });

export const programmerVirement = ({ utilisateurId, montant, type = 'virement' }) => ({
  type: progVirConst.ASYNC_PROGRAM_VIREMENT_START,
  url: 'depots',
  method: 'post',
  datas: { utilisateurId, montant, type },
});

export const loadVirements = (utilisateurId) => ({
  type: loadVirConst.ASYNC_LOAD_VIREMENTS_START,
  url: 'depots',
  query: { utilisateurId },
});

export const annulerVirement = (id) => ({
  type: supprVirConst.ASYNC_ANNULER_VIREMENT_START,
  url: `depots/${id}`,
  method: 'del',
  id,
});

export const deposerCB = (datas) => ({
  type: depotCbConst.ASYNC_DEPOT_CB_START,
  url: 'charges',
  datas,
});
