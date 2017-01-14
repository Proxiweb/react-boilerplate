import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Toggle } from 'material-ui';
import { saveAccount } from 'containers/CompteUtilisateur/actions';

class Notifications extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    auth: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    saveProfile: PropTypes.func.isRequired,
  }

  handleToggle1 = (event, isInputChecked) => {
    const { auth, saveProfile } = this.props;
    const { veilleLivraison } = auth.notifications;
    const profile = { ...auth, notifications: { veilleLivraison, nouvelleCommande: isInputChecked } };
    saveProfile(auth.id, profile, null);
  }

  handleToggle2 = (event, isInputChecked) => {
    const { auth, saveProfile } = this.props;
    const { nouvelleCommande } = auth.notifications;
    const profile = { ...auth, notifications: { nouvelleCommande, veilleLivraison: isInputChecked } };
    saveProfile(auth.id, profile, null);
  }

  render() {
    const { auth, pending } = this.props;
    return (
      <Paper zDepth={2} style={{ padding: '1rem', minHeight: '444px' }}>
        <div className="row center-md">
          <div className="col-md-10">
            <p style={{ textAlign: 'left', marginBottom: 5 }}><strong>Envoyer les notifications</strong></p>
            <Toggle
              toggled={auth.notifications.nouvelleCommande}
              label="Par SMS"
              disabled={pending}
              labelPosition="left"
              labelStyle={{ textAlign: 'left' }}
              onToggle={this.handleToggle1}
            />
            <Toggle
              toggled={auth.notifications.nouvelleCommande}
              label="Par email"
              disabled={pending}
              labelPosition="left"
              labelStyle={{ textAlign: 'left' }}
              onToggle={this.handleToggle1}
            />
          </div>

          <div className="col-md-10">
            <p style={{ textAlign: 'left', marginBottom: 5 }}><strong>Notifications :</strong></p>
            <Toggle
              toggled={auth.notifications.nouvelleCommande}
              label="Envoyer le résumé hebdomadaire des commandes"
              disabled={pending}
              labelPosition="left"
              labelStyle={{ textAlign: 'left' }}
              onToggle={this.handleToggle1}
            />
          </div>
          <div className="col-md-10">
            <Toggle
              toggled={auth.notifications.veilleLivraison}
              labelPosition="left"
              label="Envoyer un rappel la veille d'une distribution"
              disabled={pending}
              labelStyle={{ textAlign: 'left' }}
              onToggle={this.handleToggle2}
            />
          </div>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.compteUtilisateur.auth,
  pending: state.global.pending,
});

const mapDispatchToProps = (dispatch) => ({
  saveProfile: (id, datas, msgSuccess, redirect) => dispatch(saveAccount(id, datas, msgSuccess, redirect)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
