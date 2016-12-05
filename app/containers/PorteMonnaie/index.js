/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import round from 'lodash.round';
import { selectPayments, selectBalance } from 'containers/CompteUtilisateur/selectors';
import ListePaiements from './components/ListePaiements';
import styles from './styles.css';

export class PorteMonnaie extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    compte: PropTypes.object.isRequired,
    payments: PropTypes.array.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  render() {
    const { compte, payments } = this.props;
    const muiTheme = this.context.muiTheme;
    // const profile = { nom: 'GUYOMARCH', prenom: 'Régis' };
    return (
      <div className="row">
        <div className={`col-md-6 ${styles.panel}`}>
          <div className={`${styles.porteMonnaie}`}>
            <span className={styles.solde}>Solde :</span>
            <span className={styles.montant}> {round(compte.balance, 2)}</span>
          </div>
          {payments && payments.length > 0 && <ListePaiements paiements={payments} />}
        </div>
        <div className={`col-md-6 ${styles.panel}`}>
          <div className={`${styles.porteMonnaie}`} style={{ textAlign: 'center' }}>Approvisionner le porte-monnaie</div>
          <Tabs
            inkBarStyle={{ height: 7, backgroundColor: muiTheme.appBar.color, marginTop: -7 }}
          >
            <Tab label="Virement Sepa">
              <div className={styles.appro}>
                <h1>Test</h1>
              </div>
            </Tab>
            <Tab label="Carte bancaire">
              <div className={styles.appro}>
                <h1>Test2</h1>
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
});

export default connect(mapStateToProps)(PorteMonnaie);
