import React, { Component, PropTypes } from 'react';
import round from 'lodash/round';
import { Link } from 'react-router';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import FondsOkMessage from './FondsOkMessage';
import FondsWarningMessage from './FondsWarningMessage';

import styles from './styles.css';

export default class Paiement extends Component {
  // eslint-disable-line
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commandeId: PropTypes.string,
    dateLimite: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {
      balance,
      offres,
      commandeContenus,
      commandeId,
      dateLimite,
      utilisateurId,
    } = this.props;
    const { muiTheme } = this.context;

    const { prix, recolteFond } = calculeTotauxCommande({
      commandeContenus,
      offres,
      commandeId,
      filter: cc => cc.utilisateurId === utilisateurId,
    });
    const montant = round(prix + recolteFond, 2).toFixed(2);

    return (
      <div>
        {balance > montant
          ? <FondsOkMessage
            color={muiTheme.appBar.color}
            montant={montant}
            balance={balance}
          />
          : <FondsWarningMessage
            color={muiTheme.palette.warningColor}
            montant={montant}
            balance={balance}
            dateLimite={dateLimite}
          />}
        <div className={styles.accueilLink}>
          <span>{'<< '}<Link to="/">{"Retour à l'accueil"}</Link> {' <<'}</span>
        </div>
      </div>
    );
  }
}
