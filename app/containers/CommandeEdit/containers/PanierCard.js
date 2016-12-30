import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import AlertWarningIcon from 'material-ui/svg-icons/alert/warning';
import OrderValidate from './OrderValidate';
import round from 'lodash/round';
import shader from 'shader';

import {
  selectOffres,
  selectCommandeContenus,
} from 'containers/Commande/selectors';

import { selectMontantBalance } from 'containers/CompteUtilisateur/selectors';

import { calculeTotauxCommande } from 'containers/Commande/utils';

class PanierCard extends Component { // eslint-disable-line
  static propTypes = {
    toggleState: PropTypes.func.isRequired,
    commandeUtilisateur: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.array.isRequired,
    contenus: PropTypes.array.isRequired,
    balance: PropTypes.number.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    nbreProduits: PropTypes.number.isRequired,
    panierExpanded: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  buildTitle = (nbreProduits, panierExpanded) => {
    const { commandeUtilisateur } = this.props;
    if (commandeUtilisateur && commandeUtilisateur.id) return '';
    return nbreProduits && !panierExpanded ? 'Cliquez ici pour valider la commande' : '';
  }

  render() {
    const {
      offres,
      commandeContenus,
      commandeId,
      nbreProduits,
      contenus,
      panierExpanded,
      params,
      toggleState,
      utilisateurId,
      balance,
    } = this.props;

    const totaux = calculeTotauxCommande({
      contenus,
      commandeId,
      offres,
      commandeContenus,
    });

    const { muiTheme } = this.context;

    let msgPaiement = null;

    if (!panierExpanded) {
      msgPaiement =
        round(totaux.prix + totaux.recolteFond, 2) <= balance
          ? (<span style={{ color: shader(muiTheme.appBar.color, -0.4) }}>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<ActionDoneIcon style={{ verticalAlign: 'middle', color: shader(muiTheme.appBar.color, -0.4) }} />
            {'\u00A0'}Fonds porte-monnaie suffisants
          </span>)
          : (<span style={{ color: muiTheme.palette.warningColor }}>
              {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
              <AlertWarningIcon style={{ verticalAlign: 'middle', color: muiTheme.palette.warningColor }} />
            {'\u00A0'}Fonds porte-monnaie insuffisants
            </span>);
    }
    return (
      <Card style={{ marginBottom: 20 }} onExpandChange={toggleState} expanded={panierExpanded}>
        <CardHeader
          title={(
            <span>
              Panier : <strong>{round(totaux.prix + totaux.recolteFond, 2).toFixed(2) || 0} €</strong>
              {panierExpanded
                ? <span> (dont <strong>{round(totaux.recolteFond, 2).toFixed(2)} €</strong> pour la prestation de distribution)</span>
              : ` - ${nbreProduits} produit${nbreProduits > 1 ? 's' : ''}`
              }
              {msgPaiement}
            </span>
          )}
          titleStyle={{ width: '600px' }}
          subtitle={this.buildTitle(nbreProduits, panierExpanded)}
          actAsExpander={nbreProduits > 0}
          showExpandableButton={nbreProduits > 0}
        /> {/**/}
        <CardText expandable style={{ paddingTop: 0 }}>
          { contenus.length === 0 ?
            <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
            <OrderValidate params={params} utilisateurId={utilisateurId} panierExpanded={panierExpanded} />
          }
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: selectOffres(),
  balance: selectMontantBalance(),
  commandeContenus: selectCommandeContenus(),
});


export default connect(mapStateToProps)(PanierCard);
