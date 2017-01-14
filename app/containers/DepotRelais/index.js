import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';
import includes from 'lodash/includes';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { ajouterDepot } from 'containers/AdminDepot/actions';
import { selectRoles } from 'containers/CompteUtilisateur/selectors';
import styles from './styles.css';

class DepotRelais extends Component { // eslint-disable-line
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    balance: PropTypes.object.isRequired,
    deposer: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    totalCommande: PropTypes.number.isRequired,
    relaiId: PropTypes.string.isRequired,
    roles: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
  }

  state = {
    montant: null,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.utilisateurId !== nextProps.utilisateurId) {
      this.setState({
        montant: null,
      });
    }
  }

  handleDeposer = () => {
    const { deposer, utilisateurId, relaiId } = this.props;
    const { montant } = this.state;
    const type = 'depot_relais';

    const depot = {
      utilisateurId,
      infosSupplement: { relaiId },
      montant,
      type,
    };

    deposer(depot);
  }

  handleDepotExpress = () => ({})

  render() {
    const { totalCommande, balance, roles, onRequestClose } = this.props;
    const manque = round(parseFloat(balance.balance) - totalCommande, 2);
    const max = round(parseFloat(balance.limit) - parseFloat(balance.balance));
    const manqueStr = manque > 0 ? '' : `( manque ${(manque * -1).toFixed(2)} €)`;
    return (
      <Dialog
        title={`Déposer des fonds ( ${max} €)`}
        actions={
          [
            <FlatButton
              label="Annuler"
              primary
              onTouchTap={onRequestClose}
            />,
            includes(roles, 'ADMIN')
            ? <RaisedButton label="Depot express" primary onTouchTap={this.handleDepotExpress} />
          : <RaisedButton label="Ajouter au borderau" primary onTouchTap={this.handleDepotRelais} />,
          ]
        }
        modal={false}
        open={this.props.open}
        onRequestClose={onRequestClose}
      >
        <div className={`row center-md ${styles.form}`}>
          <div className="col-md-12">
            <TextField
              type="number"
              fullWidth
              floatingLabelText={`Montant reçu ${manqueStr}`}
              label="Montant reçu"
              onChange={(event, montant) => this.setState({ montant })}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  roles: selectRoles(),
});

const mapDispatchToProps = (dispatch) => ({
  deposer: (montant) => dispatch(ajouterDepot(montant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepotRelais);
