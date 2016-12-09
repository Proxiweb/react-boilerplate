import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import AlertWarningIcon from 'material-ui/svg-icons/alert/warning';
import shader from 'shader';

const buildMessage = (icon, msg) => (
  <Paper style={{ padding: '1em', marginTop: '1em' }}>
    <div className="row">
      <div className="col-md-2">
        {icon}
      </div>
      <div className="col-md-10">
        {msg}
      </div>
    </div>
  </Paper>
);

export default class Paiement extends Component { // eslint-disable-line
  static propTypes = {
    montant: PropTypes.number.isRequired,
    dateLimite: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { balance, montant, dateLimite } = this.props;
    const { muiTheme } = this.context;
    if (balance > montant) {
      return buildMessage(
        <ActionDoneIcon style={{ height: 40, width: 40, color: shader(muiTheme.appBar.color, -0.4), paddingLeft: '1em' }} />,
        <span style={{ lineHeight: '1.5em' }}>
          {'Votre porte-monnaie présente un solde de '}<strong>{balance.toFixed(2)} €</strong><br />
          {'Il sera débité de '}<strong>{montant.toFixed(2)} €</strong> quand cette commande sera finalisée.
        </span>
      );
    }

    return buildMessage(
      <AlertWarningIcon style={{ height: 40, width: 40, color: muiTheme.palette.warningColor, padding: '0.4em 1em' }} />,
      <div>
        <span>
          {'Votre porte-monnaie présente un solde de '}<strong>{balance.toFixed(2)} €</strong>, {'ce n\'est pas suffisant. '}
        </span>
        <span>
          {'Pour qu\'elle soit validée, il faudrait approvisionner votre compte d\'au moins '}<strong>{15}{' €'}</strong>{' avant le :'}
        </span>
        <div style={{ textAlign: 'center', marginTop: '1em' }}>
          <strong>{dateLimite}</strong>
        </div>
      </div>
    );
  }
}
