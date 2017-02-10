import React, { Component, PropTypes } from 'react';
import round from 'lodash/round';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import FondsOkMessage from './FondsOkMessage';
import FondsWarningMessage from './FondsWarningMessage';

export default class Paiement extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commandeId: PropTypes.string,
    dateLimite: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { balance, contenus, offres, commandeContenus, commandeId, dateLimite } = this.props;
    const { muiTheme } = this.context;
    const { prix, recolteFond } = calculeTotauxCommande({ contenus, commandeContenus, offres, commandeId });
    const montant = round(prix + recolteFond, 2).toFixed(2);

    return balance > montant
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
        />;
    }
  }
