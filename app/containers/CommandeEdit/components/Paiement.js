import React, { Component, PropTypes } from 'react';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import AlertWarningIcon from 'material-ui/svg-icons/alert/warning';
import shader from 'shader';
import round from 'lodash/round';

import { calculeTotauxCommande } from 'containers/Commande/utils';

const buildMessage = (icon, msg, color) => (
  <div style={{ padding: '1em', marginTop: '1em', border: `solid 5px ${color}` }}>
    <div className="row">
      <div className="col-md-2">
        {icon}
      </div>
      <div className="col-md-10">
        {msg}
      </div>
    </div>
  </div>
);

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
    if (balance > montant) {
      return buildMessage(
        <ActionDoneIcon style={{ height: 40, width: 40, color: shader(muiTheme.appBar.color, -0.4), paddingLeft: '1em' }} />,
        <span style={{ lineHeight: '1.5em' }}>
          {'Votre porte-monnaie présente un solde de '}<strong>{balance.toFixed(2)} €</strong><br />
          {'Il sera débité de '}<strong>{montant} €</strong> quand cette commande sera finalisée.
        </span>,
        shader(muiTheme.appBar.color, -0.4)
      );
    }

    return buildMessage(
      <AlertWarningIcon style={{ height: 40, width: 40, color: muiTheme.palette.warningColor, padding: '0.4em 1em' }} />,
      <div>
        <span>
          {'Votre porte-monnaie présente un solde de '}<strong>{balance.toFixed(2)} €</strong>, {'ce n\'est pas suffisant. '}
        </span>
        <span>
          {'Pour qu\'elle soit validée, il faudrait approvisionner votre compte d\'au moins '}
          <strong>{round(montant - balance, 2).toFixed(2)} €</strong>{' avant le :'}
        </span>
        <div style={{ textAlign: 'center', marginTop: '1em' }}>
          <strong>{dateLimite}</strong>
        </div>
      </div>,
      muiTheme.palette.warningColor
    );
  }
}
