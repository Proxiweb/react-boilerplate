/*
 *
 * App constants
 *
 */
import generateConstants from 'utils/asyncSagaConstants';

export const ADD_MESSAGE = 'app/App/ADD_MESSAGE';
export const REMOVE_MESSAGE = 'app/App/REMOVE_MESSAGE';
export const GLOBAL_PENDING_START = 'app/App/GLOBAL_PENDING_START';
export const GLOBAL_PENDING_STOP = 'app/App/GLOBAL_PENDING_STOP';

export const messagesConst = generateConstants('app/App', 'load_messages');
