import expect from 'expect';
import commandeEditReducer from '../reducer';
import { fromJS } from 'immutable';

describe('commandeEditReducer', () => {
  it('returns the initial state', () => {
    expect(commandeEditReducer(undefined, {})).toEqual(fromJS({}));
  });
});
