/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LoginForm from '../../components/LoginForm';
import { login, register, motdepasse } from './actions';
// import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { selectLocationState } from 'containers/App/selectors';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    locationState: PropTypes.object.isRequired,
  }

  render() {
    const { locationBeforeTransitions: { query: { action } } } = this.props.locationState;
    return (
      <LoginForm {...this.props} onSuccessRedirect="/votre-compte" action={action || 'login'} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  // user: selectCompteUtilisateur(),
  locationState: selectLocationState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: ({ username, password, redirectPathname }) => dispatch(login({ username, password, redirectPathname })),
    register: ({ username, password, passwordConfirm, redirectPathname }) => dispatch(register({ username, password, passwordConfirm, redirectPathname })),
    motdepasse: ({ username, redirectPathname }) => dispatch(motdepasse({ username, redirectPathname })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
