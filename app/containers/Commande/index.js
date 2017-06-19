import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import isWithinRange from 'date-fns/is_within_range';
import addWeeks from 'date-fns/add_weeks';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import isAfter from 'date-fns/is_after';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import includes from 'lodash/includes';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Paper from 'material-ui/Paper';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectAsyncState,
  makeSelectRelaisId,
  makeSelectCommandesRelais,
  makeSelectTypesProduits,
  makeSelectFournisseursIds,
  makeSelectOffres,
  makeSelectCommandesUtilisateurs,
  makeSelectProduits,
} from './selectors';

import {
  makeSelectAuthUtilisateurId,
  makeSelectRoles,
} from 'containers/CompteUtilisateur/selectors';

import {
  makeSelectLocationState,
  makeSelectPending,
} from 'containers/App/selectors';

import styles from './styles.css';
import Semainier from './components/Semainier';
import CommandesLongTerme from './containers/CommandesLongTerme';

import {
  loadCommandes,
  loadOffres,
  loadFournisseurs,
  ajouter,
  loadCommande,
} from './actions';

export class Commande extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    commandes: PropTypes.object,
    commandesUtilisateurs: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
    relaiId: PropTypes.string.isRequired,
    produits: PropTypes.object,
    fournisseurs: PropTypes.object,
    typesProduits: PropTypes.object,
    loadCommandes: PropTypes.func.isRequired,
    loadOffres: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    roles: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonClicked: false,
      lastUpdated: new Date(),
    };
  }

  componentDidMount = () => {
    const { relaiId } = this.props; // eslint-disable-line
    this.timer = setInterval(
      () => this.setState({ ...this.state, lastUpdated: new Date() }),
      30000 // 30 sec
    );
    this.props.loadFournisseurs({ relaiId, jointures: true });
    this.props.loadOffres({ relaiId, jointures: true });
    this.props.loadCommandes({ relaiId, periode: 'courantes' });
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  getCommandeInfos = id => {
    const { produits, commandes, typesProduits, fournisseurs } = this.props;
    const commande = commandes[id];
    return uniq(
      flatten(
        commande.datesLimites
          .filter(
            dL =>
              fournisseurs[dL.fournisseurId] &&
              fournisseurs[dL.fournisseurId].visible &&
              (!dL.dateLimite || isAfter(dL.dateLimite, this.state.lastUpdated))
          )
          .map(dL =>
            Object.keys(produits)
              .filter(
                pdtId =>
                  produits[pdtId].visible &&
                  produits[pdtId].fournisseurId === dL.fournisseurId
              )
              .map(pdtId => produits[pdtId].typeProduitId)
              .map(typePdtId => typesProduits[typePdtId].nom)
          )
      )
    );
  };

  commandeUtilisateurExiste = commandeId => {
    const { commandesUtilisateurs, utilisateurId } = this.props;
    return Object.keys(commandesUtilisateurs).find(
      key =>
        commandesUtilisateurs[key].utilisateurId === utilisateurId &&
        commandesUtilisateurs[key].commandeId === commandeId
    );
  };

  isInWeek = (dateCommande, weekOffset = 0) => {
    if (!isAfter(dateCommande, new Date())) return false;
    const plusWeekOffset = addWeeks(new Date(), weekOffset);
    const debut = startOfDay(startOfWeek(plusWeekOffset));
    const fin = endOfDay(endOfWeek(plusWeekOffset));
    return isWithinRange(dateCommande, debut, fin);
  };

  filterByWeek = (weekOffset = 0) =>
    Object.keys(this.props.commandes)
      .filter(
        key =>
          !this.props.commandes[key].terminee &&
          this.isInWeek(
            this.props.commandes[key].distributions[0].debut,
            weekOffset
          )
      )
      .slice()
      .sort(key => !this.props.commandes[key].noCommande);

  commandesLongTerme = () => {
    const { commandes } = this.props;
    return Object.keys(commandes)
      .filter(
        key =>
          !commandes[key].dateCommande ||
          isAfter(commandes[key].dateCommande, addWeeks(new Date(), 3))
      )
      .slice()
      .sort(key => !commandes[key].noCommande);
  };

  buildTitleAndMeta = () =>
    (<Helmet
      title={'Proxiweb - Commande en cours'}
      meta={[{ name: 'description', content: 'Commandes proxiweb' }]}
    />);

  render() {
    const {
      commandes,
      relaiId,
      pushState,
      pending,
      utilisateurId,
      typesProduits,
      roles,
      offres,
      fournisseurs,
    } = this.props;

    const { buttonClicked, lastUpdated } = this.state;

    const isAdmin = includes(roles, 'RELAI_ADMIN') || includes(roles, 'ADMIN');
    if (
      !buttonClicked &&
      commandes &&
      Object.keys(commandes).length > 0 &&
      Object.keys(offres).length > 0 &&
      Object.keys(fournisseurs).length > 0 &&
      typesProduits
    ) {
      return (
        <div className="row">
          {this.buildTitleAndMeta()}
          <Semainier
            titreCol="Cette semaine"
            commandesIds={this.filterByWeek()}
            commandes={commandes}
            getCommandeInfos={key => this.getCommandeInfos(key)}
            relaiId={relaiId}
            pushState={pushState}
            pending={pending}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={commandeId =>
              this.commandeUtilisateurExiste(commandeId)}
            buttonClicked={() => this.setState({ buttonClicked: true })}
            withLink={isAdmin}
          />
          <Semainier
            titreCol="La semaine prochaine"
            commandesIds={this.filterByWeek(1)}
            commandes={commandes}
            getCommandeInfos={key => this.getCommandeInfos(key)}
            relaiId={relaiId}
            pending={pending}
            pushState={pushState}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={commandeId =>
              this.commandeUtilisateurExiste(commandeId)}
            buttonClicked={() => this.setState({ buttonClicked: true })}
            withLink={isAdmin}
          />
          <Semainier
            titreCol="Dans quinze jours"
            commandesIds={this.filterByWeek(2)}
            commandes={commandes}
            relaiId={relaiId}
            pending={pending}
            getCommandeInfos={key => this.getCommandeInfos(key)}
            pushState={pushState}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={commandeId =>
              this.commandeUtilisateurExiste(commandeId)}
            buttonClicked={() => this.setState({ buttonClicked: true })}
            withLink={isAdmin}
          />
          <div className="col-xs">
            <CommandesLongTerme
              commandesIds={this.commandesLongTerme()}
              getCommandeInfos={key => this.getCommandeInfos(key)}
              pending={pending}
              commandes={commandes}
              commandeUtilisateurExiste={commandeId =>
                this.commandeUtilisateurExiste(commandeId)}
              buttonClicked={() => this.setState({ buttonClicked: true })}
              pushState={pushState}
              relaiId={relaiId}
              utilisateurId={utilisateurId}
              withLink={isAdmin}
            />
          </div>
        </div>
      );
    }

    if (buttonClicked) {
      return (
        <div className="row center-md">
          {this.buildTitleAndMeta()}
          <div className="col-md-6">
            <div style={{ margin: 'auto', width: '70px' }}>
              <RefreshIndicator
                size={70}
                left={0}
                top={20}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (!commandes || !offres || !fournisseurs || !typesProduits) {
      return (
        <div className={`${styles.loader} row`}>
          {this.buildTitleAndMeta()}
          <Paper className="col-md-12">
            <div style={{ margin: 'auto', width: '70px' }}>
              <RefreshIndicator
                size={70}
                left={0}
                top={20}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </div>
            <div
              style={{
                margin: '40px auto',
                width: '300px',
                textAlign: 'center',
              }}
            >
              Chargement des commandes...
            </div>
          </Paper>
        </div>
      );
    }

    return (
      <div>
        {this.buildTitleAndMeta()}
        <div className="row center-md">
          <div className="col-md-6">
            <Paper className={`${styles.noCommande}`}>
              {commandes &&
                Object.keys(commandes).length === 0 &&
                <h2>Pas de commande en cours...</h2>}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  // fonctionne sur homepage sans passer par le router params{ relaiId: 'xxxx' }
  // est passé en props, fonctionne aussi avec le routage /relais/xxx/commandes
  commandes: makeSelectCommandesRelais(),
  commandesUtilisateurs: makeSelectCommandesUtilisateurs(),
  relaiId: makeSelectRelaisId(),
  utilisateurId: makeSelectAuthUtilisateurId(),
  roles: makeSelectRoles(),
  produits: makeSelectProduits(),
  fournisseurs: makeSelectFournisseursIds(),
  offres: makeSelectOffres(),
  typesProduits: makeSelectTypesProduits(),
  asyncState: makeSelectAsyncState(),
  route: makeSelectLocationState(),
  pending: makeSelectPending(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadCommandes: page => dispatch(loadCommandes(page)),
    loadOffres: query => dispatch(loadOffres(query)),
    loadFournisseurs: query => dispatch(loadFournisseurs(query)),
    loadCommande: id => dispatch(loadCommande(id)),
    pushState: url => dispatch(push(url)),
    ajouter: (contenuId, qte) => dispatch(ajouter(contenuId, qte)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commande);
