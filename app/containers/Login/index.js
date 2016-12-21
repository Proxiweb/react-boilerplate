/*
 *
 * Login
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm';
import { login, register, motdepasse } from './actions';
import styles from './styles.css';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={`${styles.login}`}>
        <LoginForm {...this.props} onSuccessRedirect="/votre-compte" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.compteUtilisateur });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: ({ username, password, redirectPathname }) => dispatch(login({ username, password, redirectPathname })),
    register: ({ username, password, passwordConfirm, redirectPathname }) => dispatch(register({ username, password, passwordConfirm, redirectPathname })),
    motdepasse: ({ username, redirectPathname }) => dispatch(motdepasse({ username, redirectPathname })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
