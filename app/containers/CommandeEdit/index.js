/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import MediaQuery from 'components/MediaQuery';
import Helmet from 'react-helmet';
import shader from 'shader';
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
  selectAuthUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import { selectCommande } from './selectors';
import { selectAuthUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import { ajouter, augmenter, diminuer, supprimer, sauvegarder, annuler, load, setDistibution } from './actions';
import OrderValidate from './components/OrderValidate';
import DetailOffres from './components/DetailOffres';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    commandeProduits: PropTypes.array.isRequired,
    quantiteOffresAchetees: PropTypes.array,
    // livraisons: PropTypes.array,
    offres: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
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

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      panierExpanded: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentDidMount() {
    const { commandeUtilisateur, typeProduits, commandeProduits, params, utilisateurId, route, router } = this.props;
    router.setRouteLeaveHook(route, this.routerWillLeave);
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

  setPanierState = (state) => this.setState({ panierExpanded: state })

  toggleState = () => {
    this.setState({ panierExpanded: !this.state.panierExpanded });
  }

  handleChange(event, index, value) {
    const { commandeId, relaiId } = this.props.params;
    this.setPanierState(true);
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}`);
  }

  navigateTo(productId) {
    const { commandeId, typeProduitId, relaiId } = this.props.params;
    this.setPanierState(false);
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}`);
  }

  routerWillLeave = () => (this.props.commandeUtilisateur && this.props.commandeUtilisateur.id ? true : 'Annuler la commande ?')

  showOffres = () => {
    const {
      quantiteOffresAchetees,
      typeProduits,
      utilisateurId,
      fournisseur,
      produitsById,
      ajouter,  // eslint-disable-line
      params,
    } = this.props;

    return (
      <DetailOffres
        offres={quantiteOffresAchetees}
        typeProduits={typeProduits}
        utilisateurId={utilisateurId}
        fournisseur={fournisseur}
        produit={produitsById[params.produitId]}
        commandeId={params.commandeId}
        ajouter={ajouter}
      />
    );
  }

  showPanier = () => {
    const {
      commande,
      params,
      utilisateurId,
      sauvegarder, // eslint-disable-line
      supprimer, // eslint-disable-line
      annuler, // eslint-disable-line
      augmenter, // eslint-disable-line
      diminuer, // eslint-disable-line
      setDistibution, // eslint-disable-line
      produitId, // eslint-disable-line
      produitsById,
      offres,
    } = this.props;

    return (
      <OrderValidate
        commande={commande}
        produitsById={produitsById}
        offres={offres}
        commandeId={params.commandeId}
        utilisateurId={utilisateurId}
        sauvegarder={sauvegarder}
        annuler={annuler}
        supprimer={supprimer}
        augmenter={augmenter}
        diminuer={diminuer}
        setDistibution={setDistibution}
      />
    );
  }

  render() {
    const {
      typeProduits,
      produits,
      quantiteOffresAchetees,
      params,
      commande,
      offres,
      supprimer, // eslint-disable-line
      utilisateurId,
    } = this.props;

    const muiTheme = this.context.muiTheme;

    const { panierExpanded } = this.state;

    if (!utilisateurId) return null;

    const { typeProduitId, produitId } = params;
    if (!typeProduits) return null;

    const nbreProduits = commande.contenus.length;

    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <div
          className={`col-sm-4 col-lg-3 col-xs-12 col-md-4 ${styles[`produits${produits && produits.length > 10 ? 'Scr' : ''}`]}`}
        >
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
                  className={styles.pdtSelected}
                  style={
                    produitId && pdt.id === produitId ?
                    { borderLeft: `solid 5px ${muiTheme.appBar.color}`, backgroundColor: shader(muiTheme.appBar.color, +0.6) } :
                    { borderLeft: 'none' }}
                >
                  {pdt.nom}
                </ListItem>
              ))}
            </List>
            )}
        </div>
        <MediaQuery query="(max-device-width: 1600px)">
          <div className="col-md-8 col-xs-12 col-lg-9">
            <Card style={{ marginBottom: 20 }} onExpandChange={this.toggleState} expanded={panierExpanded}>
              <CardHeader
                title={<span>Panier : <strong>{commande.montant || 0} €</strong> - {nbreProduits} produits</span>}
                subtitle={nbreProduits && !panierExpanded ? 'Cliquez ici pour valider la commande' : ''}
                actAsExpander={nbreProduits > 0}
                showExpandableButton={nbreProduits > 0}
              />
              <CardText expandable>
                { (!commande || commande.contenus.length === 0 || !offres) ?
                  <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
                  this.showPanier()
                }
              </CardText>
            </Card>
            {quantiteOffresAchetees && typeProduits && !panierExpanded && this.showOffres()}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-4">
            {quantiteOffresAchetees && typeProduits && !panierExpanded && this.showOffres()}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-5" style={{ paddingLeft: 0, paddingRight: 0 }}>
            { (!commande || commande.contenus.length === 0 || !offres) ?
              <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
              this.showPanier()
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
  utilisateurId: selectAuthUtilisateurId(),
  params: selectParams(),
  commandeUtilisateur: selectAuthUtilisateurCommandeUtilisateur(), // commande utilisateur existante
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
    augmenter: (offreId) => dispatch(augmenter(offreId)),
    diminuer: (offreId) => dispatch(diminuer(offreId)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
    sauvegarder: (datas) => dispatch(sauvegarder(datas)),
    annuler: (id) => dispatch(annuler(id)),
    loadCommandes: () => dispatch(loadCommandes()),
    setDistibution: (livraisonId, plageHoraire) => dispatch(setDistibution(livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommandeEdit));
