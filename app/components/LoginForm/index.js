import React, { Component, PropTypes } from 'react';
import GoogleLogin from 'react-google-login';
import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const testDatas = {
  El: '118310941698171104056',
  hg: {
    access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM3NzE1M2RkZmUwNGU2ZDA3YTFlMDgwODIxY2Y0MGE0N2EzMjk4Y2YifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6IlpRS3ZfLUxyQmxHQmFqWnRzYzZIb2ciLCJhdWQiOiIxNTA1NjEwMTM4NTctazdkZjRuYm1mbTIxbzNuMm5xNTJsaWEwOXUzNHZjb3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgzMTA5NDE2OTgxNzExMDQwNTYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMTUwNTYxMDEzODU3LWs3ZGY0bmJtZm0yMW8zbjJucTUybGlhMDl1MzR2Y29zLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJyZWdpc2dAZ21haWwuY29tIiwiaWF0IjoxNDcwNjQzNDcyLCJleHAiOjE0NzA2NDcwNzIsIm5hbWUiOiJSw6lnaXMgR3V5b21hcmNoIiwiZ2l2ZW5fbmFtZSI6IlLDqWdpcyIsImZhbWlseV9uYW1lIjoiR3V5b21hcmNoIiwibG9jYWxlIjoiZnIifQ.qO10ule6-iAIs__DSD9X5IsZBGdS4FWl3PtTIa5739OtkuelyJuCIh9l_aRfAYOkmtQ4FhNTtUEChIyUp46W2lATXTiyp0ZXyS_PENbnPQgB-CN2nUPQNvNV8FwFTzL89Xk6pWPCSQVT1rGCPNpzrNz6CbKQQLMO0KfJIOUixoJ06FoT4FOw5sb3v6SZ4hIGcXT46ZolMqb0o9eo3FCeTGlI0i9BM5FwtVYRuEcXg0ZhROi7FiV6KxJGiYBBJOPHFBynjkp3TgiEIS50LxjSj7CIedV6D0hN7MUwxq-uELUdKtRMlj_PI4g_LdT9JYmmoVVrBN0ymvrCQjP7UWAm1g',
  },
  Ka: {
    Na: 'Guyomarch',
    Za: 'Régis',
    hg: 'regisg@gmail.com',
  },
};

export default class LoginForm extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    onSuccessRedirect: PropTypes.string,
    user: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleFormSubmit = ::this.handleFormSubmit;
    this.handleGoogleLogin = ::this.handleGoogleLogin;
  }

  handleGoogleLogin(event) {
    event.preventDefault();
    this.props.googleLogin(testDatas, this.props.onSuccessRedirect);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.props.login(
      this.username.getValue(),
      this.password.getValue(),
      this.props.onSuccessRedirect
    );
  }

  render() {
    return (
      <div className={`row ${styles.login}`}>
        <div className={`col-md-6 ${styles.paddedHoriz}`}>
          <h3 className={styles.formHeader}>Déjà client ?</h3>
          <form className="form form-inline" onSubmit={this.handleFormSubmit}>
            <div className="col-md-6 col-md-offset-3 text-center">
                <TextField hintText="Identifiant" floatingLabelText="Identifiant" ref={ (node) => this.username = node}/>
                <TextField hintText="Mot de passe" floatingLabelText="Mot de passe" ref={ (node) => this.password = node} type="password" />
                <div className="with-margin-top">
                    <RaisedButton primary label="Se connecter" type="submit" />
                </div>
            </div>
          </form>
        </div>
        <div className={`col-md-6 ${styles.paddedHoriz}`}>
          <h3 className={styles.formHeader}>Connexion rapide</h3>
          <button className="btn btn-primary btn-block btn-lg" onClick={this.handleGoogleLogin}>Se connecter avec Facebook</button><br />
          <GoogleLogin
            clientId="150561013857-k7df4nbmfm21o3n2nq52lia09u34vcos.apps.googleusercontent.com"
            buttonText="Se connecter avec Google"
            callback={this.handleGoogleLogin}
          />
        </div>
      </div>
  ); }
}
