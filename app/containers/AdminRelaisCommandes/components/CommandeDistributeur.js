import React, { PropTypes, Component } from 'react';
import DetailCommandeDistributeur from './DetailCommandeDistributeur';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import DetailCommandeTotal from './DetailCommandeTotal';

class CommandeFournisseur extends Component {
  // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    commandeId: PropTypes.string.isRequired,
    supprimeCommandeContenusFournisseur: PropTypes.func.isRequired,
    key: PropTypes.string.isRequired,
  };

  render() {
    const {
      produits,
      contenus: contenusObj,
      commandeContenus,
      commandeId,
      offres,
      key,
    } = this.props;
    const contenus = commandeContenus.map(key => contenusObj[key]);

    const totaux = calculeTotauxCommande({
      contenus,
      offres,
      commandeContenus,
      commandeId,
    });
    console.log(totaux);

    return (
      <div className="row" key={key}>
        <div className="col-md-12">
          <h4>Part Distributeur</h4>
          <DetailCommandeDistributeur
            contenus={contenus}
            commandeContenus={contenus}
            produits={produits}
            commandeId={commandeId}
            offres={offres}
          />
          <DetailCommandeTotal totaux={totaux} />
        </div>
      </div>
    );
  }
}

export default CommandeFournisseur;