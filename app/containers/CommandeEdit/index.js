/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import MediaQuery from 'components/MediaQuery';
import Helmet from 'react-helmet';
import {
  selectCommandeTypesProduits,
  selectCommandeProduits,
  selectFournisseurProduit,
  selectProduits,
  selectParams,
  selectAuthUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import { selectAuthUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart';

import { selectCommande } from './selectors';

import {
  initCommande,
  setDistibution,
  load,
} from './actions';

import ProduitSelector from './containers/ProduitSelector';
import OrderValidate from './containers/OrderValidate';
import DetailOffres from './containers/DetailOffres';
import PanierCard from './containers/PanierCard';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    commandeProduits: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commande: PropTypes.object,
    commandeUtilisateur: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,

    pushState: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
    loadCommandeUtilisateur: PropTypes.func.isRequired,
    loadCdes: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    panierExpanded: false,
  };

  componentDidMount() {
    const {
      commande,
      params,
      typeProduits,
      commandeProduits,
      utilisateurId,
      route,
      router,
      commandeUtilisateur,
      init,
      pushState,
      loadCdes,
      loadCommandeUtilisateur,
    } = this.props;

    if (!commande) {
      init(params.commandeId);
    }

    router.setRouteLeaveHook(route, this.routerWillLeave);

    if (!utilisateurId) {
      pushState('/login');
    }

    if (!commandeProduits) {
      loadCdes();
      return;
    }

    if (commandeUtilisateur) {
      loadCommandeUtilisateur(commandeUtilisateur);
    }

    const { commandeId, relaiId } = params;

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
      commandeUtilisateur,
      commande,
      supprimer, // eslint-disable-line
      utilisateurId,
    } = this.props;

    const muiTheme = this.context.muiTheme;

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
            <PanierCard
              nbreProduits={nbreProduits}
              panierExpanded={this.state.panierExpanded}
              commandeId={params.commandeId}
              contenus={commande.contenus}
              params={params}
              toggleState={this.toggleState}
              utilisateurId={utilisateurId}
              commandeUtilisateur={commandeUtilisateur}
            />
            {!panierExpanded && <DetailOffres params={params} />}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-4">
            {!panierExpanded && <DetailOffres params={params} />}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-5">
            { (!commande || commande.contenus.length === 0)
              ? <div className={`row ${styles.panel}`}>
                <div className="col-md-5" style={{ textAlign: 'right' }}>
                  <ShoppingCart style={{ height: 100, width: 100, color: muiTheme.appBar.color }} />
                </div>
                <div className="col-md-5">
                  <h1 style={{ textAlign: 'left', color: muiTheme.appBar.color }}>Panier vide</h1>
                </div>
              </div>
              : <OrderValidate params={params} utilisateurId={utilisateurId} panierExpanded={false} />
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
  produitsById: selectProduits(),
  utilisateurId: selectAuthUtilisateurId(),
  commandeUtilisateur: selectAuthUtilisateurCommandeUtilisateur(),
  params: selectParams(),
  fournisseur: selectFournisseurProduit(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    init: (commandeId) => dispatch(initCommande(commandeId)),
    loadCommandeUtilisateur: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    loadCdes: () => dispatch(loadCommandes()),
    setDistibution: (commandeId, livraisonId, plageHoraire) => dispatch(setDistibution(commandeId, livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommandeEdit));
