import expect from 'expect';
import compteUtilisateurReducer from '../reducer';
import { fromJS } from 'immutable';

describe('compteUtilisateurReducer', () => {
  it('returns the initial state', () => {
    expect(compteUtilisateurReducer(undefined, {})).toEqual(fromJS({}));
  });
});
