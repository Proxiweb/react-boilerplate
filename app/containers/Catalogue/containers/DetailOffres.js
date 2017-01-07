import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import AffichePrix from 'containers/CommandeEdit/components/components/AffichePrix';
import { createStructuredSelector } from 'reselect';
import {
    selectOffresDuProduit,
    selectTypesProduitsRelais,
    selectFournisseursRelais,
    selectProduitsRelaisByTypeProduit,
} from 'containers/Commande/selectors';

import styles from './styles.css';

class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array,
    produits: PropTypes.array.isRequired,
    typeProduits: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array,
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
    const {
      offres,
      fournisseurs,
      produits,
      typeProduits,
      params,
    } = this.props;

    if (!offres || !typeProduits) return null;
    const { produitId, relaiId } = params;
    const produit = produits.find((pdt) => pdt.id === produitId);

    if (!produit) {
      return <h1>Produit non trouvé</h1>;
    }

    const fournisseur = fournisseurs.find((f) => f.id === produit.fournisseurId);
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
          {viewOffre && <div className={`${styles.produitTitre} col-md-12`}>{produit.nom.toUpperCase()}</div>}
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
        { viewOffre && offres.filter((o) => o.active && o.relaiId === relaiId).map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);

          return (
            <div key={idx} className={`row ${styles.offre}`} style={{ backgroundColor: muiTheme.palette.groupColor, border: `solid 1px ${muiTheme.palette.groupColorBorder}` }}>
              <div className="col-md-12">
                <Card>
                  <CardHeader
                    actAsExpander
                    showExpandableButton
                    title={<AffichePrix offre={offre} typeProduit={typeProduit} />}
                  >
                  </CardHeader>
                  <CardText expandable>
                    lorem
                  </CardText>
                </Card>
              </div>
            </div>);
        })}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectTypesProduitsRelais(),
  offres: selectOffresDuProduit(),
  fournisseurs: selectFournisseursRelais(),
  produits: selectProduitsRelaisByTypeProduit(),
});

export default connect(mapStateToProps)(DetailOffres);
