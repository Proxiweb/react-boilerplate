/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import round from 'lodash/round';

import {
  selectPayments,
  selectBalance,
  selectVirements,
  selectCompteUtilisateur,
} from 'containers/CompteUtilisateur/selectors';

import {
  programmerVirement,
  loadVirements,
  annulerVirement,
  deposerCB,
} from 'containers/CompteUtilisateur/actions';

import { selectParams } from 'containers/App/selectors';

import Virements from './components/Virements';
import CarteBleue from './components/CarteBleue';
import ListeEffetsCompteStellar from 'components/ListeEffetsCompteStellar/ListeEffetsCompteStellar';

import styles from './styles.css';

export class PorteMonnaie extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    compte: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    virements: PropTypes.oneOfType([PropTypes.array]),
    params: PropTypes.object.isRequired,
    loadVir: PropTypes.func.isRequired,
    progVir: PropTypes.func.isRequired,
    annulVir: PropTypes.func.isRequired,
    depCb: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { loadVir, params } = this.props;
    loadVir(params.userId);
  };

  render() {
    const { compte, progVir, params, virements, annulVir, auth, depCb } = this.props;
    const muiTheme = this.context.muiTheme;
    if (!compte) return null;
    return (
      <div className="row">
        <div className={`col-md-6 ${styles.panel}`}>
          <div className={`${styles.porteMonnaie}`}>
            <span className={styles.solde}>Solde :</span>
            <span className={styles.montant}> {round(compte.balance, 2)}</span>
          </div>
          {auth.stellarKeys &&
            <ListeEffetsCompteStellar stellarAddress={auth.stellarKeys.adresse} limit="10" />}
        </div>
        <div className={`col-md-6 ${styles.panel}`}>
          <div className={`${styles.porteMonnaie}`} style={{ textAlign: 'center' }}>
            Approvisionner le porte-monnaie
          </div>
          <Tabs inkBarStyle={{ height: 7, backgroundColor: muiTheme.appBar.color, marginTop: -7 }}>
            <Tab label="Virement Sepa">
              <div className={styles.appro}>
                <div className="row center-md">
                  {virements !== null &&
                    <Virements
                      max={compte.limit - compte.balance}
                      programmerVirement={progVir}
                      utilisateurId={params.userId}
                      virements={virements}
                      annulerVirement={annulVir}
                    />}
                </div>
              </div>
            </Tab>
            <Tab label="Carte bancaire">
              <div className={styles.appro}>
                <div className="row center-md">
                  <CarteBleue max={compte.limit - compte.balance} email={auth.email} deposerCB={depCb} />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  payments: selectPayments(),
  compte: selectBalance(),
  virements: selectVirements(),
  params: selectParams(),
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      progVir: programmerVirement,
      loadVir: loadVirements,
      annulVir: annulerVirement,
      depCb: deposerCB,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PorteMonnaie);
