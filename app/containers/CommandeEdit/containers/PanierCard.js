import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import OrderValidate from './OrderValidate';
import round from 'lodash.round';

import {
  selectOffres,
  selectCommandeContenus,
} from 'containers/Commande/selectors';
import { calculeTotauxCommande } from 'containers/Commande/utils';

class PanierCard extends Component { // eslint-disable-line
  static propTypes = {
    toggleState: PropTypes.func.isRequired,
    commandeUtilisateur: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.array.isRequired,
    contenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    nbreProduits: PropTypes.number.isRequired,
    panierExpanded: PropTypes.bool.isRequired,
  }

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
    } = this.props;

    const totaux = calculeTotauxCommande({
      contenus,
      commandeId,
      offres,
      commandeContenus,
    });

    return (
      <Card style={{ marginBottom: 20 }} onExpandChange={toggleState} expanded={panierExpanded}>
        <CardHeader
          title={(
            <span>
              Panier : <strong>{round(totaux.prix + totaux.recolteFond, 2).toFixed(2) || 0} €</strong> - {nbreProduits} produit{nbreProduits > 1 && 's'}
            </span>
          )}
          subtitle={this.buildTitle(nbreProduits, panierExpanded)}
          actAsExpander={nbreProduits > 0}
          showExpandableButton={nbreProduits > 0}
        /> {/**/}
        <CardText expandable>
          { contenus.length === 0 ?
            <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
            <OrderValidate params={params} utilisateurId={utilisateurId} />
          }
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: selectOffres(),
  commandeContenus: selectCommandeContenus(),
});


export default connect(mapStateToProps)(PanierCard);
