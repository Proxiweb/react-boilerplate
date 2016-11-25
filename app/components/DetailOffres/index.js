import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import AffichePrix from 'components/AffichePrix';
import styles from './styles.css';

export default class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array.isRequired,
    produit: PropTypes.object.isRequired,
    typeProduits: PropTypes.array.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    fournisseur: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    ajouter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewOffre: true,
    };
  }

  render() {
    const { viewOffre } = this.state;
    const { offres, ajouter, fournisseur, utilisateurId, commandeId, produit, typeProduits } = this.props;

    return (
      <div className={styles.offres}>
        <div className="row">
          <div className={`col-md-12 ${styles.fournisseurSwitch}`}>
            <FlatButton
              onClick={() => this.setState((oldState) => ({ viewOffre: !oldState.viewOffre }))}
              primary
              label={viewOffre ? fournisseur.nom : 'Afficher les offres'}
            />
          </div>
          <div className="col-md-6">
            {viewOffre && <img src={`https://proxiweb.fr/${produit.photo}`} alt={produit.nom} style={{ width: '100%', height: 'auto' }} />}
            {!viewOffre && <img src={`https://proxiweb.fr/${fournisseur.illustration}`} alt={produit.nom} style={{ width: '100%', height: 'auto' }} />}
          </div>
          <div className="col-md-6">
            {viewOffre && <p dangerouslySetInnerHTML={{ __html: produit.description }} />}
            {!viewOffre && <p dangerouslySetInnerHTML={{ __html: fournisseur.presentation }} />}
          </div>
        </div>
        { viewOffre && offres.map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
          const etatStock = offre.stock !== null && offre.stock === 0 ? 'horsStock' : 'enStock';
          return (
            <div key={idx} className={`row ${styles.offre}`}>
              <div className="col-md-4 col-lg-3">
                <span className={styles[etatStock]}>
                  {produit.nom}{offre.stock !== null ? `(${offre.stock})` : ''} {offre.description}
                </span>
              </div>
              <div className="col-md-5 col-lg-6">
                <AffichePrix offre={offre} typeProduit={typeProduit} />
              </div>
              <div className="col-md-3">
                <RaisedButton
                  onClick={() => ajouter({ offreId: offre.id, quantite: 1, commandeId, utilisateurId })}
                  primary
                  fullWidth
                  icon={<AddShoppingCart />}
                />
              </div>
            </div>);
        })}
      </div>
    );
  }
}
