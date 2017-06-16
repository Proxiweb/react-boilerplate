import expect from 'expect';
import { fromJS, Map } from 'immutable';
import notificationsReducer from '../reducer';
import uuid from 'node-uuid';

import {
  addMessage,
  loadMessages,
  removeMessage,
  marquerCommeLu,
  saveMessage,
  selectionneRelais,
  setStellarKeys,
  startGlobalPending,
  stopGlobalPending,
} from '../actions';

describe('appReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      messages: [],
      pending: true,
      utilisateur_messages: {
        loaded: false,
        datas: [],
      },
      relaiId: null,
      stellarKeys: null,
      nombre_clients: 0,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(notificationsReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the addMessage action correctly', () => {
    const message = 'Une erreur est survenue';
    const id = uuid.v4();
    const expectedResult = state.updateIn(['messages'], arr =>
      arr.push(fromJS({ message, id }))
    );

    expect(notificationsReducer(state, addMessage(message, id))).toEqual(
      expectedResult
    );
  });

  it('should handle the removeMessage action correctly', () => {
    const message = 'Une erreur est survenue';
    const id = uuid.v4();
    const stateWithMessage = state.set('messages', fromJS([{ message, id }]));

    expect(notificationsReducer(stateWithMessage, removeMessage(id))).toEqual(
      state
    );
  });
  //
  // it('should handle the reposLoaded action correctly', () => {
  //   const fixture = [{
  //     name: 'My Repo',
  //   }];
  //   const username = 'test';
  //   const expectedResult = state
  //     .setIn(['userData', 'repositories'], fixture)
  //     .set('loading', false)
  //     .set('currentUser', username);
  //
  //   expect(appReducer(state, reposLoaded(fixture, username))).toEqual(expectedResult);
  // });
  //
  // it('should handle the repoLoadingError action correctly', () => {
  //   const fixture = {
  //     msg: 'Not found',
  //   };
  //   const expectedResult = state
  //     .set('error', fixture)
  //     .set('loading', false);
  //
  //   expect(appReducer(state, repoLoadingError(fixture))).toEqual(expectedResult);
  // });
});
