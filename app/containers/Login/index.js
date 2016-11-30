/*
 *
 * Login
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm';
import { login, googleLogin } from './actions';
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
    login: (username, password, redirectPathname) => dispatch(login(username, password, redirectPathname)),
    googleLogin: (googleLoginResponse, redirectPathname) => dispatch(googleLogin(googleLoginResponse, redirectPathname)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
