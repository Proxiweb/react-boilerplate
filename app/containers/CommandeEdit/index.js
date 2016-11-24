/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import MediaQuery from 'components/MediaQuery';
import Helmet from 'react-helmet';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
  selectCommandeProduits,
  selectFournisseurProduit,
  selectProduits,
  selectOffres,
  selectParams,
  selectCommandeLivraisons,
  selectQuantiteOffresAchetees,
  selectUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import { selectCommande } from './selectors';
import { selectUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import { ajouter, supprimer, sauvegarder, annuler, load, setDistibution } from './actions';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import OrderValidate from 'components/OrderValidate';
import DetailOffres from 'components/DetailOffres';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    commandeProduits: PropTypes.array.isRequired,
    quantiteOffresAchetees: PropTypes.array,
    livraisons: PropTypes.array,
    offres: PropTypes.object.isRequired,
    // offresRelais: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    sauvegarder: PropTypes.func.isRequired,
    annuler: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,
    loadCommandes: PropTypes.func.isRequired,

    load: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateur: PropTypes.object,
    produitsById: PropTypes.object,
    commande: PropTypes.object,
    fournisseur: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
    relaiId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentDidMount() {
    const { commandeUtilisateur, typeProduits, commandeProduits, params, utilisateurId } = this.props;

    if (!utilisateurId) {
      this.props.pushState('/login');
    }

    if (!commandeProduits) {
      this.props.loadCommandes();
      return;
    }

    const { commandeId, relaiId } = params;
    if (commandeUtilisateur) {
      this.props.load(commandeUtilisateur);
    }

    // sélectionner le premier produit du premier type
    const premierTypeProduit = typeProduits && typeProduits.length ? typeProduits[0] : null;
    if (premierTypeProduit) {
      const pdts = commandeProduits.filter((prod) => prod.typeProduitId === premierTypeProduit.id);
      if (pdts && pdts.length) {
        this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${premierTypeProduit.id}/produits/${pdts[0].id}`);
      }
    }
  }

  handleChange(event, index, value) {
    const { commandeId, relaiId } = this.props.params;
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}`);
  }

  navigateTo(productId) {
    const { commandeId, typeProduitId, relaiId } = this.props.params;
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}`);
  }

  render() {
    const {
      typeProduits,
      produits,
      produitsById,
      quantiteOffresAchetees,
      params,
      commande,
      fournisseur,
      offres,
      supprimer, // eslint-disable-line
      utilisateurId,
      livraisons,
    } = this.props;

    if (!utilisateurId) return null;

    const { typeProduitId, commandeId, produitId } = params;
    if (!typeProduits) return null;

    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <div className="col-md-3 col-xs-12 col-md-offset-1">
          {typeProduits && <SelectField
            value={typeProduitId}
            onChange={this.handleChange}
            iconStyle={{ fill: 'black' }}
            underlineStyle={{ borderColor: 'black' }}
            style={{ width: '100%' }}
          >
            { typeProduits && typeProduits.map((type, index) => <MenuItem key={index} value={type.id} primaryText={type.nom} />)}
          </SelectField>}
          {produits && (
            <List>
              {produits.map((pdt, idx) => (
                <ListItem
                  key={idx}
                  onClick={() => this.navigateTo(pdt.id)}
                  style={produitId && pdt.id === produitId ? { backgroundColor: 'red', color: 'white' } : {}}
                >
                  {pdt.nom}
                </ListItem>
              ))}
            </List>
            )}
        </div>
        <div className="col-md-7 col-xs-12">
          <MediaQuery query="(min-device-width: 1224px)">
            <Card style={{ marginBottom: 20 }}>
              <CardHeader
                title={`Total panier : XX €`}
                subtitle="6 produits"
                actAsExpander
                showExpandableButton
              />
              <CardText expandable>
                { (!commande || commande.contenus.length === 0 || !offres) ?
                  <h1>Panier vide</h1> :
                  <OrderValidate
                    commande={commande}
                    commandeId={commandeId}
                    utilisateurId={utilisateurId}
                    sauvegarder={this.props.sauvegarder}
                    annuler={this.props.annuler}
                    supprimer={this.props.supprimer}
                    setDistibution={this.props.setDistibution}
                    produitsById={produitsById}
                    offres={offres}
                  />
                }
              </CardText>
            </Card>
          </MediaQuery>
          {quantiteOffresAchetees && typeProduits &&
            <DetailOffres
              offres={quantiteOffresAchetees}
              typeProduits={typeProduits}
              utilisateurId={utilisateurId}
              fournisseur={fournisseur}
              produits={produits}
              commandeId={commandeId}
              ajouter={this.props.ajouter}
            />
          }
        </div>
        <MediaQuery query="(max-device-width: 1224px)">
          <div className="col-md-5 col-xs-12">
            { (!commande || commande.contenus.length === 0 || !offres) ?
              <h1>Panier vide</h1> :
              <OrderValidate
                commande={commande}
                commandeId={commandeId}
                utilisateurId={utilisateurId}
                sauvegarder={this.props.sauvegarder}
                annuler={this.props.annuler}
                supprimer={this.props.supprimer}
                setDistibution={this.props.setDistibution}
                produitsById={produitsById}
                offres={offres}
              />
            }
          </div>
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  commandeProduits: selectCommandeProduits(),
  offres: selectOffres(),
  produitsById: selectProduits(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  utilisateurId: selectUtilisateurId(),
  params: selectParams(),
  commandeUtilisateur: selectUtilisateurCommandeUtilisateur(), // commande utilisateur existante
  commande: selectCommande(), // commande courante en cours d'édition
  livraisons: selectCommandeLivraisons(),
  fournisseur: selectFournisseurProduit(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    load: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    ajouter: (offre) => dispatch(ajouter(offre)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
    sauvegarder: (datas) => dispatch(sauvegarder(datas)),
    annuler: (id) => dispatch(annuler(id)),
    loadCommandes: () => dispatch(loadCommandes()),
    setDistibution: (livraisonId, plageHoraire) => dispatch(setDistibution(livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
