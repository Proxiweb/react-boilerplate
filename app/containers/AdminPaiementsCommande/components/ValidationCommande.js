import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import round from 'lodash/round';

export default class ValidationCommande extends Component { // eslint-disable-line
  static propTypes = {
    depots: PropTypes.array.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    paiements: PropTypes.object.isRequired,
    totaux: PropTypes.object.isRequired,
  }

  render() {
    const { paiements, totaux, commandeUtilisateurs, depots } = this.props;
    let allOks = true;
    commandeUtilisateurs.forEach((cu) => {
      const dep = depots.find((d) =>
        d.utilisateurId === cu.utilisateurId &&
        !d.transfertEffectue &&
        d.type === 'depot_relais'
      );

      // si un dépot a été fait, en tenir compte
      const totalAvecDepot = dep && dep.montant
        ? round(parseFloat(dep.montant) + parseFloat(paiements[cu.utilisateurId].balance), 2)
        : round(parseFloat(paiements[cu.utilisateurId].balance), 2);

      if (totaux[cu.utilisateurId] > totalAvecDepot) {
        allOks = false;
      }
    });
    if (!allOks) return null;

    return (
      <div className="row center-md" style={{ marginBottom: '1em' }}>
        <div className="col-md-6"><RaisedButton label="Valider la commande" primary /></div>
      </div>
    );
  }
}
