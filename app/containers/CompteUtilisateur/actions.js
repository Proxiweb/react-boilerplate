
import {
  saveAccountConst,
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
    { nom, prenom, adresse, adresseComplementaire, codePostal, ville, telPortable, telFixe, email, pseudo, notifications },
    msgSuccess = 'Profile sauvegardé'
  ) => ({
    type: saveAccountConst.ASYNC_SAVE_ACCOUNT_START,
    url: `utilisateurs/${utilisateurId}`,
    method: 'put',
    datas: { nom, prenom, adresse, adresseComplementaire, codePostal, ville, telPortable, telFixe, email, pseudo, notifications },
    msgSuccess,
  });
