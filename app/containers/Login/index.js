/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm';
import { login, googleLogin } from './actions';
import styles from './styles.css';
import RefreshIndicator from 'material-ui/RefreshIndicator';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    login: PropTypes.func.isRequired,
    user: PropTypes.object,
  }

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
