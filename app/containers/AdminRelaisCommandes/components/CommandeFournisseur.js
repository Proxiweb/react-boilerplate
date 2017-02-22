import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import DetailCommande from './DetailCommande';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import { supprimerCommandeContenusFournisseur } from 'containers/Commande/actions';
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

  handleSupprCommandeContenusFourn = event => {
    const {
      fournisseur,
      commandeId,
      supprimeCommandeContenusFournisseur,
    } = this.props;
    event.preventDefault();
    supprimeCommandeContenusFournisseur({
      fournisseurId: fournisseur.id,
      commandeId,
    });
  };

  render() {
    const {
      fournisseur,
      produits,
      contenus,
      commandeContenus,
      commandeId,
      offres,
      key,
    } = this.props;
    const contenusFournisseur = commandeContenus
      .map(key => contenus[key])
      .filter(c =>
        produits.find(pdt => pdt.id === c.offre.produitId && pdt.fournisseurId === fournisseur.id));

    const totaux = calculeTotauxCommande({
      contenus: contenusFournisseur,
      offres,
      commandeContenus,
      commandeId,
    });

    return (
      <div className="row" key={key}>
        <div className="col-md-8" style={{ margin: '3em 0 0.5em' }}>
          <h4>{fournisseur.nom.toUpperCase()}</h4>
        </div>
        <div className="col-md-4" style={{ textAlign: 'right', margin: '3em 0 0.5em' }}>
          <RaisedButton secondary label="Retirer" onClick={this.handleSupprCommandeContenusFourn} />
        </div>
        <div className="col-md-12">
          <DetailCommande
            contenus={contenusFournisseur}
            commandeContenus={contenusFournisseur}
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

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    supprimeCommandeContenusFournisseur: supprimerCommandeContenusFournisseur,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(CommandeFournisseur);
