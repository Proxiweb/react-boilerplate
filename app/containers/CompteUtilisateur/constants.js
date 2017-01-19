import generateConstants from '../../utils/asyncSagaConstants';

export const saveAccountConst = generateConstants('app/compte_utilisateur', 'SAVE_ACCOUNT');
export const progVirConst = generateConstants('app/compte_utilisateur', 'PROGRAM_VIREMENT');
export const loadVirConst = generateConstants('app/compte_utilisateur', 'LOAD_VIREMENTS');
export const supprVirConst = generateConstants('app/compte_utilisateur', 'ANNULER_VIREMENT');
export const depotCbConst = generateConstants('app/compte_utilisateur', 'DEPOT_CB');

export const LOAD_ACCOUNT = 'app/compte_utilisateur/LOAD_ACCOUNT';
export const LOAD_ACCOUNT_SUCCESS = 'app/compte_utilisateur/LOAD_ACCOUNT_SUCCESS';
export const LOAD_ACCOUNT_ERROR = 'app/compte_utilisateur/LOAD_ACCOUNT_ERROR';
export const STORE_STELLAR_KEYS = 'app/compte_utilisateur/STORE_STELLAR_KEYS';
