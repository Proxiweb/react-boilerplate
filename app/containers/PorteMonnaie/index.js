/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import round from 'lodash.round';
import { selectPayments, selectBalance } from 'containers/CompteUtilisateur/selectors';
import ListePaiements from 'components/ListePaiements';
import styles from './styles.css';

export class PorteMonnaie extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    compte: PropTypes.object.isRequired,
    payments: PropTypes.array.isRequired,
  }

  render() {
    const { compte, payments } = this.props;
    // const profile = { nom: 'GUYOMARCH', prenom: 'Régis' };
    return (
      <div className="row">
        <div className="col-md-6">
          <div className={`${styles.porteMonnaie}`}>
            <span className={styles.solde}>Solde :</span>
            <span className={styles.montant}> {round(compte.balance, 2)}</span>
          </div>
          {payments && payments.length > 0 && <ListePaiements paiements={payments} />}
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
