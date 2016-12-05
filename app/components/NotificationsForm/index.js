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
    dispatch: PropTypes.func.isRequired,
  }

  handleToggle1 = (event, isInputChecked) => {
    const { auth } = this.props; // saveProfile
    const { veilleLivraison } = auth.notifications;
    const profile = { ...auth, notifications: { veilleLivraison, nouvelleCommande: isInputChecked } };
    this.props.dispatch(saveAccount(auth.id, profile));
    // saveProfile(auth.id, profile);
  }

  handleToggle2 = (event, isInputChecked) => {
    const { saveProfile, auth } = this.props;
    const { nouvelleCommande } = auth.notifications;
    saveProfile(auth.id, { ...auth, notifications: { nouvelleCommande, veilleLivraison: isInputChecked } });
  }

  render() {
    const { auth, pending } = this.props;
    return (
      <Paper zDepth={2} style={{ padding: '1rem', minHeight: '444px' }}>
        <div className="row">
          <div className="col-md-6">
            <Toggle
              toggled={auth.notifications.nouvelleCommande}
              label="À chaque nouvelle commande"
              disabled={pending}
              onToggle={this.handleToggle1}
              trackStyle={{ backgroundColor: 'red' }}
            />
          </div>
          <div className="col-md-6">
            <Toggle
              toggled={auth.notifications.veilleLivraison && false}
              label="Les veilles de livraison"
              disabled={pending}
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
  saveProfile: (datas) => dispatch(saveAccount(datas)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
