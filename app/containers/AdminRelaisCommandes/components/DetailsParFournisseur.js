import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
  selectOffres,
} from 'containers/Commande/selectors';

import CommandeFournisseur from './CommandeFournisseur';

class DetailsParFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
  }

  render() {
    const { commandeContenus, contenus, produits, fournisseurs, offres, params } = this.props;
    const { commandeId } = params;
    return (
      <div>
        {fournisseurs
          .filter((f) => f.visible)
          .map((fournisseur, idx) => (
            <CommandeFournisseur
              key={idx}
              fournisseur={fournisseur}
              produits={produits.filter((pdt) => pdt.fournisseurId === fournisseur.id)}
              commandeContenus={commandeContenus}
              contenus={contenus}
              offres={offres}
              commandeId={commandeId}
            />
          ))}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
  offres: selectOffres(),
});

export default connect(mapStateToProps)(DetailsParFournisseur);
