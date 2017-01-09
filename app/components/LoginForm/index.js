import React, { Component, PropTypes } from 'react';
import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class LoginForm extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired, // eslint-disable-line
    register: PropTypes.func.isRequired, // eslint-disable-line
    motdepasse: PropTypes.func.isRequired, // eslint-disable-line
    onSuccessRedirect: PropTypes.string,
  }

  state = {
    view: 'login',
  }

  componentDidMount = () => {
    this.username.focus();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.view !== prevState.view) {
      this.username.focus();
    }
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { view } = this.state;
    this.props[view]({
      username: this.username.getValue(),
      password: this.password ? this.password.getValue() : null,
      passwordConfirm: this.passwordConfirm ? this.passwordConfirm.getValue() : null,
      redirectPathname: this.props.onSuccessRedirect,
    });
  }

  buildSubmitLabel = () => {
    const { view } = this.state;
    if (view === 'login') return 'Se connecter';
    if (view === 'register') return 'S\'inscrire';
    return 'Envoyer';
  }

  render() {
    const { view } = this.state;
    return (
      <div className={`row center-md ${styles.login}`}>
        <div className={`col-md-6 ${styles.paddedHoriz}`}>
          <h3 className={styles.formHeader}>
            {view === 'login' && 'Déjà inscrit ?'}
            {view === 'register' && 'S\'inscrire'}
            {view === 'motdepasse' && 'Obtenir un nouveau mot de passe'}
          </h3>
          <form className="form form-inline" onSubmit={this.handleFormSubmit}>
            <div className="col-md-6 col-md-offset-3 text-center">
              <TextField floatingLabelText={`Email ${view !== 'motdepasse' ? ' ou pseudo' : ''}`} ref={(node) => (this.username = node)} type="email" />
              {(view !== 'motdepasse' &&
                <TextField floatingLabelText="Mot de passe" ref={(node) => (this.password = node)} type="password" />
              )}
              {view === 'register' &&
                <TextField floatingLabelText="Mot de passe (confirmation)" ref={(node) => (this.passwordConfirm = node)} type="password" />
              }
              <div className="with-margin-top">
                <RaisedButton primary label={this.buildSubmitLabel()} type="submit" />
              </div>
            </div>
          </form>
          <div className="row with-margin-top">
            <div className="col-md-6">
              {view === 'login' && <FlatButton label="Créer un compte" onClick={() => this.setState((oldState) => ({ ...oldState, view: 'register' }))} />}
              {view !== 'login' && <FlatButton label="Se connecter" onClick={() => this.setState((oldState) => ({ ...oldState, view: 'login' }))} />}
            </div>
            <div className="col-md-6">
              {view !== 'motdepasse' && <FlatButton label="Mot de passe oublié" onClick={() => this.setState((oldState) => ({ ...oldState, view: 'motdepasse' }))} />}
              {view === 'motdepasse' && <FlatButton label="Créer un compte" onClick={() => this.setState((oldState) => ({ ...oldState, view: 'register' }))} />}
            </div>
          </div>
        </div>
      </div>
  ); }
}
