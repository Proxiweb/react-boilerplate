import { fromJS } from 'immutable';
import expect from 'expect';

import {
  makeSelectGlobal,
  makeSelectPending,
  makeSelectRelaiId,
  makeSelectStellarKeys,
  makeSelectMessages,
  makeSelectNombreClients,
  makeSelectMessageUtilisateur,
  makeSelectMessagesUtilisateurLoaded,
  makeSelectLocationState,
} from '../selectors';

describe('makeSelectGlobal', () => {
  const globalSelector = makeSelectGlobal();
  it('should select the global state', () => {
    const globalState = fromJS({});
    const mockedState = fromJS({
      global: globalState,
    });
    expect(globalSelector(mockedState)).toEqual(globalState);
  });
});
