import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import api from 'utils/stellarApi';
import round from 'lodash/round';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { ajouterDepot } from 'containers/AdminDepot/actions';
import { selectRoles } from 'containers/CompteUtilisateur/selectors';
import styles from './styles.css';

class DepotRelais extends Component { // eslint-disable-line
  static propTypes = {
    utilisateur: PropTypes.object.isRequired,
    balance: PropTypes.object.isRequired,
    stellarKeys: PropTypes.object,
    deposer: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    totalCommande: PropTypes.number.isRequired,
    relaiId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string,
    roles: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      type: includes(props.roles, 'RELAI_ADMIN') ? 'especes' : null,
      montant: null,
      info: null,
      depotEnCours: false,
      depotOk: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.utilisateurId !== nextProps.utilisateurId) {
      this.setState({
        ...this.state,
        montant: null,
        info: null,
      });
    }
  }

  handleDeposer = () => {
    const { deposer, utilisateur, relaiId } = this.props;
    const { montant } = this.state;
    const type = 'depot_relais';

    const depot = {
      utilisateurId: utilisateur.id,
      infosSupplement: { relaiId },
      montant,
      type,
    };

    deposer(depot);
  }

  handleDepotExpress = () => {
    const { stellarKeys, utilisateur, deposer } = this.props;
    const { montant, type, info } = this.state;
    this.setState({ ...this.state, depotEnCours: true });
    api.pay({
      destination: utilisateur.stellarKeys.adresse,
      currency: 'PROXI',
      currencyIssuer: stellarKeys.adresse,
      amount: montant,
      stellarKeys,
    }).then((transactionHash) => {
      this.setState({ ...this.state, depotEnCours: false, depotOk: true });
      deposer({
        utilisateurId: utilisateur.id,
        montant,
        type: 'depot_direct',
        infosSupplement: {
          ...info,
          type,
          transactionHash,
        },
      });
    });
  }

  render() {
    const {
      totalCommande,
      balance,
      roles,
      onRequestClose,
      stellarKeys,
    } = this.props;
    const { montant, type } = this.state;
    const manque = round(parseFloat(balance.balance) - totalCommande, 2);
    const max = round(parseFloat(balance.limit) - parseFloat(balance.balance));
    const manqueStr = manque > 0 ? '' : `( manque ${(manque * -1).toFixed(2)} €)`;
    const invalid = montant === null || type === null;

    return (
      <Dialog
        title={`Déposer des fonds ( max ${max} €)`}
        actions={
          [
            <FlatButton
              label="Annuler"
              primary
              onTouchTap={onRequestClose}
            />,
            includes(roles, 'ADMIN') && stellarKeys
            ? <RaisedButton
              label="Depot express"
              primary
              type="submit"
              onClick={this.handleDepotExpress}
              disabled={invalid}
            />
            : <RaisedButton
              label="Ajouter au borderau"
              type="submit"
              primary
              onTouchTap={() => this.handleDeposer()}
              disabled={invalid}
            />,
          ]
        }
        modal={false}
        open={this.props.open}
        onRequestClose={onRequestClose}
      >
        <form>
          <div className={`row center-md ${styles.form}`}>
            <div className="col-md-6">
              <TextField
                type="number"
                fullWidth
                step="0.01"
                floatingLabelText={`Montant déposé ${manqueStr}`}
                label="Montant déposé"
                onChange={(event, m) =>
                  this.setState({ ...this.state, montant: m })
                }
              />
            </div>
            <div className="col-md-6">
              <SelectField
                fullWidth
                floatingLabelText="Type de dépot"
                label="Type de dépot"
                onChange={(event, typeId) => {
                  const values = ['cb', 'cheque', 'especes'];
                  this.setState({ ...this.state, type: values[typeId] });
                }}
                value={type}
                disabled={includes(roles, 'RELAI_ADMIN')}
              >
                <MenuItem value={'cb'} primaryText="cb" />
                <MenuItem value={'cheque'} primaryText="cheque" />
                <MenuItem value={'especes'} primaryText="especes" />
              </SelectField>
            </div>
            { !includes(roles, 'RELAI_ADMIN') &&
              <div className="col-md-12">
                <TextField
                  type="text"
                  fullWidth
                  floatingLabelText="Information supplémentaire"
                  label="Information supplémentaire"
                  onChange={(event, inf) =>
                    this.setState({ ...this.state, inf })
                  }
                />
              </div>
            }
          </div>
        </form>
      </Dialog>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  roles: selectRoles(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deposer: ajouterDepot,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DepotRelais);
