import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import AffichePrix from './components/AffichePrix';
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

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      viewOffre: true,
    };
  }


  render() {
    const { viewOffre } = this.state;
    const { offres, ajouter, fournisseur, utilisateurId, commandeId, produit, typeProduits } = this.props;
    const muiTheme = this.context.muiTheme;

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
          <div className={`${styles.produitTitre} col-md-12`}>{produit.nom}</div>
          <div className="col-md-12">
            <div className="row" style={{ margin: 5 }}>
              <div className="col-md-6">
                {viewOffre && <img src={`https://proxiweb.fr/${produit.photo}`} alt={produit.nom} style={{ width: '100%', height: 'auto', maxWidth: 200 }} />}
                {!viewOffre && <img src={`https://proxiweb.fr/${fournisseur.illustration}`} alt={produit.nom} style={{ width: '100%', height: 'auto', maxWidth: 200 }} />}
              </div>
              <div className="col-md-6">
                {viewOffre && <p dangerouslySetInnerHTML={{ __html: produit.description }} />}
                {!viewOffre && <p dangerouslySetInnerHTML={{ __html: fournisseur.presentation }} />}
              </div>
            </div>
          </div>
        </div>
        { viewOffre && offres.map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
          const enStock = offre.stock === null || offre.stock > 0;
          return (
            <div key={idx} className={`row ${styles.offre}`} style={{ backgroundColor: muiTheme.palette.groupColor, border: `solid 1px ${muiTheme.palette.groupColorBorder}` }}>
              <div className="col-md-9 col-lg-9">
                <AffichePrix offre={offre} typeProduit={typeProduit} />
              </div>
              <div className="col-md-3">
                {
                  enStock ?
                    <RaisedButton
                      onClick={() => ajouter({ offreId: offre.id, quantite: 1, commandeId, utilisateurId })}
                      primary
                      fullWidth
                      icon={<AddShoppingCart />}
                    /> :
                    <span className={styles.nonDispo}>Non disponible</span>
                }
              </div>
            </div>);
        })}
      </div>
    );
  }
}
