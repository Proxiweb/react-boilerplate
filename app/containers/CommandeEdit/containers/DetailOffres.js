import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import includes from 'lodash/includes';
import shader from 'shader';
import MediaQuery from 'components/MediaQuery';

import StarIcon from 'material-ui/svg-icons/toggle/star';
import { createStructuredSelector } from 'reselect';
import {
    selectOffresProduitAvecTotalAchats,
    selectCommandeTypesProduits,
    selectFournisseurProduit,
    selectProduits,
} from 'containers/Commande/selectors';

import { selectCommande } from 'containers/CommandeEdit/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { saveAccount } from 'containers/CompteUtilisateur/actions';

import {
  ajouter,
} from 'containers/CommandeEdit/actions';
import OffreDetails from 'components/OffreDetails';
import styles from './styles.css';

const constStyles = {
  star: {
    height: '36px',
    width: '36px',
  },
  margin: {
    margin: 10,
  },
  starButton: {
    height: '48px',
    width: '48px',
    minWidth: 'none',
  },
  imageStyle: {
    width: '100%',
    height: 'auto',
    maxWidth: 200,
  },
};

class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array,
    commande: PropTypes.object.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    produitsById: PropTypes.object.isRequired,
    typeProduits: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseur: PropTypes.object,
    ajouter: PropTypes.func.isRequired,
    saveFavoris: PropTypes.func.isRequired,
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

  toggleFav = (produitId) => {
    const { auth, saveFavoris } = this.props;
    const produitsFavoris = includes(auth.produitsFavoris, produitId)
      ? auth.produitsFavoris.filter((item) => item !== produitId)
      : auth.produitsFavoris.concat(produitId);

    const datas = { ...auth, produitsFavoris };

    saveFavoris(
      auth.id,
      datas,
      null
    );
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
      auth,
    } = this.props;

    if (!offres || !typeProduits) return null;

    const { produitId, commandeId } = params;
    const produit = produitsById[produitId];
    const contenus = commande.contenus;

    const estFavoris = auth.produitsFavoris.find((item) => item === produitId);
    return (
      <div className={styles.offreso}>
        <Paper>
          <div className="row">
            <div className={`col-md-2 ${styles.favoris}`}>
              {viewOffre &&
                <FlatButton
                  tooltip={`${estFavoris ? 'Retirer des ' : 'Ajouter aux '}produits favoris`}
                  onClick={() => this.toggleFav(produitId)}
                  style={constStyles.starButton}
                  hoverColor={shader(this.context.muiTheme.appBar.color, +0.6)}
                  title="Ajouter aux favoris"
                  icon={
                    <StarIcon
                      color={
                        estFavoris ? '#ffd203' : 'silver'
                      }
                      style={constStyles.star}
                    />
                  }
                />
              }
            </div>
            <div className={`col-md-10 ${styles.fournisseurSwitch}`}>
              <FlatButton
                onClick={() => this.setState((oldState) => ({ viewOffre: !oldState.viewOffre }))}
                primary
                hoverColor={shader(this.context.muiTheme.appBar.color, +0.6)}
                label={viewOffre ? fournisseur.nom : 'Afficher les offres'}
                title={viewOffre ? 'Afficher les infos fournisseur' : 'Afficher les produits'}
              />
            </div>
            {viewOffre && <div className={`${styles.produitTitre} col-md-12`}>{produit.nom.toUpperCase()}</div>}
            <div className="col-md-10">
              <div className="row" style={constStyles.margin}>
                <div className="col-md-6">
                  {viewOffre && <img src={`https://proxiweb.fr/${produit.photo}`} alt={produit.nom} style={constStyles.imageStyle} />}
                  {!viewOffre && <img src={`https://proxiweb.fr/${fournisseur.illustration}`} alt={produit.nom} style={constStyles.imageStyle} />}
                </div>
                <div className="col-md-6">
                  {viewOffre &&
                    <p
                      dangerouslySetInnerHTML={{ __html: produit.description }} // eslint-disable-line
                    />
                  }
                  {!viewOffre &&
                    <p
                      dangerouslySetInnerHTML={{ __html: fournisseur.presentation }} // eslint-disable-line
                    />
                  }
                </div>
              </div>
            </div>
          </div>
          { viewOffre && offres.map((offre, idx) => {
            const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
            const enStock = offre.stock === null || offre.stock > 0;

            const offreCommande = contenus.find((cont) => cont.offreId === offre.id);
            const qteCommande = offreCommande ? offreCommande.quantite : 0;
            const tR = offre.tarifications.length > 1;

            return (
              <div key={idx} className={`row ${styles.offre}`}>
                <div className="col-md-12">
                  <MediaQuery query="(max-device-width: 1600px)">
                    <OffreDetails
                      typeProduit={typeProduit}
                      offre={offre}
                      qteCommande={qteCommande}
                      subTitle="Tarif dégressif (cliquez pour plus de détails)"
                      onClick={() =>
                        this.props.ajouter(
                          commandeId,
                          { offreId: offre.id, quantite: 1, commandeId, utilisateurId }
                        )
                      }
                      expandable={tR}
                    />
                  </MediaQuery>
                  <MediaQuery query="(min-device-width: 1600px)">
                    <OffreDetails
                      typeProduit={typeProduit}
                      offre={offre}
                      qteCommande={qteCommande}
                      subTitle="Tarif dégressif (+ infos...)"
                      onClick={() =>
                        this.props.ajouter(
                          commandeId,
                          { offreId: offre.id, quantite: 1, commandeId, utilisateurId }
                        )
                      }
                      expandable={tR}
                    />
                  </MediaQuery>
                </div>
              </div>);
          })}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  offres: selectOffresProduitAvecTotalAchats(),
  fournisseur: selectFournisseurProduit(),
  produitsById: selectProduits(),
  commande: selectCommande(), // commande courante en cours d'édition
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ajouter,
  saveFavoris: saveAccount,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DetailOffres);
