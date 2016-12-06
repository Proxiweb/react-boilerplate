import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
} from 'containers/Commande/selectors';

import CommandeFournisseur from './CommandeFournisseur';

class DetailsParFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
  }

  render() {
    const { commandeContenus, contenus, produits, fournisseurs } = this.props;
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
              contenus={commandeContenus.map((key) => contenus[key])}
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
});

export default connect(mapStateToProps)(DetailsParFournisseur);
