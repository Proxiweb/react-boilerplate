/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import MediaQuery from 'components/MediaQuery';
import Helmet from 'react-helmet';
import {
  selectCommandeTypesProduits,
  selectCommandeProduits,
  selectFournisseurProduit,
  selectProduits,
  // selectOffres,
  selectParams,
  selectAuthUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import { selectCommande } from './selectors';
import { selectAuthUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import {
  initCommande,
  load,
  setDistibution,
} from './actions';
import ProduitSelector from './containers/ProduitSelector';
import OrderValidate from './containers/OrderValidate';
import DetailOffres from './containers/DetailOffres';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    commandeProduits: PropTypes.array.isRequired,
    // offres: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
    loadCommandes: PropTypes.func.isRequired,

    load: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateur: PropTypes.object,
    commande: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    panierExpanded: false,
  };

  componentDidMount() {
    const { commande, init, params } = this.props;

    if (!commande) {
      init(params.commandeId);
    }
    const { commandeUtilisateur, typeProduits, commandeProduits, utilisateurId, route, router } = this.props;
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

  componentWillUnmount() {
    const { commande, params, init } = this.props;
    if (!commande.id) {
      init(params.commandeId);
    }
  }

  setPanierState = (state) => this.setState({ panierExpanded: state })

  toggleState = () => {
    this.setState({ panierExpanded: !this.state.panierExpanded });
  }

  routerWillLeave = () => {
    const { commande } = this.props;

    if ((commande.id && !commande.modifiee) || !commande.montant) return true;
    const modifMsg1 = commande.modifiee ? ' a été modifiée mais' : '';
    const modifMsg2 = commande.modifiee ? ' annuler les modifications ' : 'l\'annuler';
    return `La commande${modifMsg1} n'a pas été validée... Souhaitez-vous ${modifMsg2} ?`;
  }

  render() {
    const {
      params,
      // typeProduits,
      commande,
      // offres,
      supprimer, // eslint-disable-line
      // utilisateurId,
    } = this.props;

    if (!commande) return null; // !utilisateurId
    const { panierExpanded } = this.state;
    const nbreProduits = commande.contenus.length;

    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="Nouvelle commande"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <ProduitSelector params={params} setPanierState={this.setPanierState} />
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
                { (!commande || commande.contenus.length === 0) ? // || !offres
                  <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
                  <OrderValidate params={params} />
                }
              </CardText>
            </Card>
            {!panierExpanded && <DetailOffres params={params} />}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-4">
            {!panierExpanded && <DetailOffres params={params} />}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-5" style={{ paddingLeft: 0, paddingRight: 0 }}>
            { (!commande || commande.contenus.length === 0) ? // || !offres
              <h1 style={{ textAlign: 'center' }}>Panier vide</h1> :
              <OrderValidate params={params} />
            }
          </div>
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  commande: selectCommande(), // commande courante en cours d'édition
  commandeProduits: selectCommandeProduits(),
  // offres: selectOffres(),
  produitsById: selectProduits(),
  utilisateurId: selectAuthUtilisateurId(),
  params: selectParams(),
  commandeUtilisateur: selectAuthUtilisateurCommandeUtilisateur(), // commande utilisateur existante
  fournisseur: selectFournisseurProduit(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    init: (commandeId) => dispatch(initCommande(commandeId)),
    load: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    loadCommandes: () => dispatch(loadCommandes()),
    setDistibution: (commandeId, livraisonId, plageHoraire) => dispatch(setDistibution(commandeId, livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommandeEdit));
