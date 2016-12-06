import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
} from 'containers/Commande/selectors';
import capitalize from 'lodash.capitalize';
import DetailCommande from './DetailCommande';

class DetailsParUtilisateur extends Component { // eslint-disable-line
  static propTypes = {
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    utilisateur: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
  }

  render() {
    const { utilisateur, contenus, produits, commandeContenus } = this.props;
    return (
      <div>
        <h1>{capitalize(utilisateur.prenom)} {utilisateur.nom.toUpperCase()}</h1>
        <DetailCommande
          contenus={commandeContenus.map((key) => contenus[key]).filter((c) => c.utilisateurId === utilisateur.id)}
          produits={produits}
        />
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

export default connect(mapStateToProps)(DetailsParUtilisateur);
