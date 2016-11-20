import generateConstants from '../../utils/asyncSagaConstants';

export const saveAccountConst = generateConstants('app/compte_utilisateur', 'SAVE_ACCOUNT');
export const LOAD_ACCOUNT = 'app/compte_utilisateur/LOAD_ACCOUNT';
export const LOAD_ACCOUNT_SUCCESS = 'app/compte_utilisateur/LOAD_ACCOUNT_SUCCESS';
export const LOAD_ACCOUNT_ERROR = 'app/compte_utilisateur/LOAD_ACCOUNT_ERROR';
