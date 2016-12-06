import React, { PropTypes, Component } from 'react';
import DetailCommande from './DetailCommande';
export default class CommandeFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
  }

  render() {
    const { fournisseur, produits, contenus } = this.props;
    return (
      <div>
        <h1>{fournisseur.nom}</h1>
        <DetailCommande produits={produits} contenus={contenus} />
      </div>
    );
  }
}
