import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import DetailCommande from './DetailCommande';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import DetailCommandeTotal from './DetailCommandeTotal';

export default class CommandeFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    commandeId: PropTypes.string.isRequired,
  }

  render() {
    const { fournisseur, produits, contenus, commandeContenus, commandeId, offres } = this.props;
    const contenusFournisseur =
      commandeContenus
        .map((key) => contenus[key])
        .filter((c) =>
          produits.find((pdt) => pdt.id === c.offre.produitId && pdt.fournisseurId === fournisseur.id)
        );
    const totaux = calculeTotauxCommande({ contenus: contenusFournisseur, offres, commandeContenus, commandeId });
    return (
      <div>
        <h1>
          <Link
            to={`/factures/${commandeId}/fournisseurs/${fournisseur.id}`}
          >
            {fournisseur.nom}
          </Link>
        </h1>
        <DetailCommande
          contenus={contenusFournisseur}
          commandeContenus={contenusFournisseur}
          produits={produits}
          commandeId={commandeId}
          offres={offres}
        />
        <DetailCommandeTotal totaux={totaux} />
      </div>
    );
  }
}
