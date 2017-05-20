import React, { Component } from 'react'; import PropTypes from 'prop-types';
import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MailIcon from 'material-ui/svg-icons/communication/mail-outline';

export default class LoginForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    pending: PropTypes.bool.isRequired,
    onSuccessRedirect: PropTypes.string,
  };

  static defaultProps = {
    action: 'login',
  };
  constructor(props) {
    super(props);
    this.state = { view: props.action };
  }

  componentDidMount = () => {
    this.username.focus();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.view !== prevState.view) {
      this.username.focus();
    }
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const { view } = this.state;
    this.props[view]({
      username: this.username.getValue(),
      password: this.password ? this.password.getValue() : null,
      passwordConfirm: (
        this.passwordConfirm ? this.passwordConfirm.getValue() : null
      ),
      redirectPathname: this.props.onSuccessRedirect,
    });
  };

  buildSubmitButton = () => {
    const { view } = this.state;
    const { pending } = this.props;
    let label;
    let icon;

    switch (view) {
      case 'login':
        label = pending ? 'Connexion...' : 'Se connecter';
        icon = <PersonIcon />;
        break;
      case 'register':
        label = pending ? 'Creaction du compte...' : "S'inscrire";
        icon = <PersonAddIcon />;
        break;
      default:
        label = pending ? 'envoi...' : 'envoyer';
        icon = <MailIcon />;
    }

    return (
      <RaisedButton fullWidth primary icon={icon} label={label} type="submit" />
    );
  };

  render() {
    const { view } = this.state;
    return (
      <div className={`row center-md ${styles.login}`}>
        <Paper className={`col-md-6 ${styles.paddedHoriz}`}>
          <h3 className={styles.formHeader}>
            {view === 'login' && 'Déjà inscrit ?'}
            {view === 'register' && "S'inscrire à ProxiWeb"}
            {view === 'motdepasse' && 'Obtenir un nouveau mot de passe'}
          </h3>
          <div className="row center-md">
            <form className="form form-inline" onSubmit={this.handleFormSubmit}>
              <div className="col-md-10 text-center">
                <TextField
                  floatingLabelText={
                    `Email ${view !== 'motdepasse' ? ' ou pseudo' : ''}`
                  }
                  ref={node => this.username = node}
                  type="text"
                />
              </div>
              {view !== 'motdepasse' &&
                <div className="col-md-10 text-center">
                  <TextField
                    floatingLabelText="Mot de passe"
                    ref={node => this.password = node}
                    type="password"
                  />
                </div>}
              {view === 'register' &&
                <div className="col-md-10text-center">
                  <TextField
                    floatingLabelText="Mot de passe (confirmation)"
                    ref={node => this.passwordConfirm = node}
                    type="password"
                  />
                </div>}
              <div className="with-margin-top">
                {this.buildSubmitButton()}
              </div>
            </form>
          </div>
          <div className="row with-margin-top">
            <div className="col-md-6">
              {view === 'login' &&
                <FlatButton
                  label="Créer un compte"
                  onClick={() => this.setState(oldState => ({
                    ...oldState,
                    view: 'register',
                  }))}
                />}
              {view !== 'login' &&
                <FlatButton
                  label="Se connecter"
                  onClick={() =>
                    this.setState(oldState => ({ ...oldState, view: 'login' }))}
                />}
            </div>
            <div className="col-md-6">
              {view !== 'motdepasse' &&
                <FlatButton
                  label="Mot de passe oublié"
                  onClick={() => this.setState(oldState => ({
                    ...oldState,
                    view: 'motdepasse',
                  }))}
                />}
              {view === 'motdepasse' &&
                <FlatButton
                  label="Créer un compte"
                  onClick={() => this.setState(oldState => ({
                    ...oldState,
                    view: 'register',
                  }))}
                />}
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
