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
import assign from 'lodash.assign';

import {
  selectCommandeTypesProduits,
  selectCommandeProduits,
  selectFournisseurProduit,
  selectProduits,
  selectParams,
  selectCommandeCommandeUtilisateurs,
  selectCommandeContenus,
  selectCommandeCommandeContenus,
  selectUtilisateurs,
} from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import {
  selectAuthUtilisateurId,
  selectMontantBalance,
} from 'containers/CompteUtilisateur/selectors';
import { selectLocationState } from 'containers/App/selectors';
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart';

import { selectCommande } from './selectors';

import {
  initCommande,
  // setDistibution,
  load,
} from './actions';

import ProduitSelector from './containers/ProduitSelector';
import OrderValidate from './containers/OrderValidate';
import DetailOffres from './containers/DetailOffres';
import PanierCard from './containers/PanierCard';
import styles from './styles.css';

import api from 'utils/stellarApi';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    commandeProduits: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    locationState: PropTypes.object.isRequired,
    commande: PropTypes.object,
    commandeUtilisateurs: PropTypes.array,
    cdeCommandeContenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array,
    authUtilisateurId: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
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
    balance: null,
  };

  componentDidMount() {
    const {
      commande,
      params,
      typeProduits,
      commandeProduits,
      route,
      router,
      commandeUtilisateurs,
      cdeCommandeContenus,
      commandeContenus,
      init,
      pushState,
      locationState,
      loadCdes,
      loadCommandeUtilisateur,
      balance,
      authUtilisateurId,
      utilisateurs,
    } = this.props;

    if (!commande) {
      init(params.commandeId);
    }

    router.setRouteLeaveHook(route, this.routerWillLeave);

    const query = locationState.locationBeforeTransitions.query;
    const utilisateurId = query.utilisateurId || null;

    if (!utilisateurId) {
      pushState('/login');
    }

    if (utilisateurId !== authUtilisateurId) {
      // si utilisateur connecté utiliser balance
      // sinon mettre à null, setBalance chargera le compte
      if (utilisateurId === authUtilisateurId) {
        this.setBalance(balance);
      } else {
        const utilisateur = utilisateurs[utilisateurId];
        this.setBalance(null, utilisateur.stellarKeys.adresse);
      }
    }

    if (commande && commande.utilisateurId !== utilisateurId) {
      init(params.commandeId);
    }

    if (!commandeProduits) {
      loadCdes();
      return;
    }

    const commandeUtilisateur = commandeUtilisateurs.find((cu) => cu.utilisateurId === utilisateurId);
    if (commandeUtilisateur) {
      const contenus =
        cdeCommandeContenus
          .map((id) => commandeContenus[id])
          .filter((cc) => cc.utilisateurId === utilisateurId);
      loadCommandeUtilisateur(assign({}, commandeUtilisateur, { contenus }));
    }

    const { commandeId, relaiId } = params;

    // sélectionner le premier produit du premier type
    const premierTypeProduit = typeProduits && typeProduits.length ? typeProduits[0] : null;
    if (premierTypeProduit) {
      const pdts = commandeProduits.filter((prod) => prod.typeProduitId === premierTypeProduit.id);
      if (pdts && pdts.length) {
        this.props.pushState(
          `/relais/${relaiId}/commandes/${commandeId}/typeProduits/${premierTypeProduit.id}/produits/${pdts[0].id}?utilisateurId=${utilisateurId}`
        );
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.balance !== null) {
      this.setBalance(nextProps.balance);
    }
  }

  componentWillUnmount() {
    const { commande, params, init } = this.props;
    if (!commande.id) {
      init(params.commandeId);
    }
  }

  /*
  *
  */
  setBalance = (balance, adresse) => {
    if (balance === null) {
      api.loadAccount(adresse)
         .then((res) => {
           const bal = res.balances.find((b) => b.asset_code === 'PROXI');
           this.setState({ ...this.state, balance: parseFloat(bal.balance) });
         });
    }
    this.setState({ ...this.state, balance });
  }

  setPanierState = (state) => this.setState({ ...this.state, panierExpanded: state })

  toggleState = () => {
    this.setState({ ...this.state, panierExpanded: !this.state.panierExpanded });
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
      commandeUtilisateurs,
      utilisateurs,
      authUtilisateurId,
      commande,
      supprimer, // eslint-disable-line
      locationState,
    } = this.props;

    if (!commande) return null;

    const { panierExpanded, balance } = this.state;
    const muiTheme = this.context.muiTheme;
    const nbreProduits = commande.contenus.length;
    const query = locationState.locationBeforeTransitions.query;
    const utilisateurId = query.utilisateurId || null;
    const commandeUtilisateur = commandeUtilisateurs.find((cu) => cu.utilisateurId === utilisateurId);

    let autreUtilisateur = null;
    if (utilisateurId !== authUtilisateurId) {
      autreUtilisateur = utilisateurs[utilisateurId];
    }

    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="Nouvelle commande"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <ProduitSelector params={params} setPanierState={this.setPanierState} utilisateurId={utilisateurId} />
        <MediaQuery query="(max-device-width: 1600px)">
          <div className="col-md-8 col-xs-12 col-lg-9">
            <PanierCard
              nbreProduits={nbreProduits}
              panierExpanded={panierExpanded}
              balance={balance}
              commandeId={params.commandeId}
              contenus={commande.contenus}
              params={params}
              toggleState={this.toggleState}
              utilisateurId={utilisateurId}
              commandeUtilisateur={commandeUtilisateur}
            />
            {!panierExpanded && <DetailOffres params={params} utilisateurId={utilisateurId} />}
          </div>
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1600px)">
          <div className="col-lg-4">
            {!panierExpanded && <DetailOffres params={params} utilisateurId={utilisateurId} />}
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
                {autreUtilisateur && <div className="col-md-12" style={{ textAlign: 'center' }}>
                  Commande de {autreUtilisateur.prenom} {autreUtilisateur.nom.toUpperCase()}
                </div>}
              </div>
              : <OrderValidate
                params={params}
                utilisateurId={utilisateurId}
                panierExpanded={false}
                balance={balance}
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
  commande: selectCommande(), // commande courante en cours d'édition
  commandeProduits: selectCommandeProduits(),
  produitsById: selectProduits(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  cdeCommandeContenus: selectCommandeCommandeContenus(),
  commandeContenus: selectCommandeContenus(),
  authUtilisateurId: selectAuthUtilisateurId(),
  utilisateurs: selectUtilisateurs(),
  params: selectParams(),
  fournisseur: selectFournisseurProduit(),
  locationState: selectLocationState(),
  balance: selectMontantBalance(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    init: (commandeId) => dispatch(initCommande(commandeId)),
    loadCommandeUtilisateur: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    loadCdes: () => dispatch(loadCommandes()),
    // setDistibution: (commandeId, livraisonId, plageHoraire) => dispatch(setDistibution(commandeId, livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommandeEdit));
