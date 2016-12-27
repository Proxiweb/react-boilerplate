import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import { createStructuredSelector } from 'reselect';
import {
    selectOffresProduitAvecTotalAchats,
    selectCommandeTypesProduits,
    selectFournisseurProduit,
    selectProduits,
} from 'containers/Commande/selectors';
import { selectAuthUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import { selectCommande } from 'containers/CommandeEdit/selectors';

import {
  ajouter,
} from 'containers/CommandeEdit/actions';

import AffichePrix from 'containers/CommandeEdit/components/components/AffichePrix';
import styles from './styles.css';

class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array,
    commande: PropTypes.object.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    produitsById: PropTypes.object.isRequired,
    typeProduits: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fournisseur: PropTypes.object,
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
    const {
      offres,
      fournisseur,
      produitsById,
      typeProduits,
      commande,
      utilisateurId,
      params,
    } = this.props;

    if (!offres || !typeProduits) return null;

    const { produitId, commandeId } = params;
    const produit = produitsById[produitId];
    const contenus = commande.contenus;
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
        { viewOffre && offres.map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
          const enStock = offre.stock === null || offre.stock > 0;

          const offreCommande = contenus.find((cont) => cont.offreId === offre.id);
          const qteCommande = offreCommande ? offreCommande.quantite : 0;

          return (
            <div key={idx} className={`row ${styles.offre}`} style={{ backgroundColor: muiTheme.palette.groupColor, border: `solid 1px ${muiTheme.palette.groupColorBorder}` }}>
              <div className="col-md-9 col-lg-9">
                <AffichePrix offre={offre} typeProduit={typeProduit} qteCommande={qteCommande} />
              </div>
              <div className="col-md-3">
                {
                  enStock ?
                    <RaisedButton
                      onClick={() => this.props.ajouter(
                        commandeId,
                        { offreId: offre.id, quantite: 1, commandeId, utilisateurId }
                      )}
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

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  offres: selectOffresProduitAvecTotalAchats(),
  fournisseur: selectFournisseurProduit(),
  produitsById: selectProduits(),
  utilisateurId: selectAuthUtilisateurId(),
  commande: selectCommande(), // commande courante en cours d'édition
});

const mapDispatchToProps = (dispatch) => ({
  ajouter: (commandeId, offre) => dispatch(ajouter(commandeId, offre)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailOffres);
