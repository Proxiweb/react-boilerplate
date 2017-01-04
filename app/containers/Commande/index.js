import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import {
  selectAsyncState,
  selectRelaisId,
  selectCommandesRelais,
  selectTypesProduits,
  selectFournisseurs,
  selectCommandesUtilisateurs,
  selectProduits } from './selectors';

import {
  selectAuthUtilisateurId,
} from 'containers/CompteUtilisateur/selectors';

import {
  selectLocationState,
  selectPending,
} from 'containers/App/selectors';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Paper from 'material-ui/Paper';
import styles from './styles.css';
import choux from './choux.jpg';
import Semainier from './components/Semainier';
import Offre from 'components/Offre';
import Panel from 'components/Panel';
import moment from 'moment';

import { loadCommandes, ajouter, loadCommande } from './actions';

export class Commande extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    commandes: PropTypes.object,
    commandesUtilisateurs: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
    relaiId: PropTypes.string,
    produits: PropTypes.object,
    route: PropTypes.object,
    fournisseurs: PropTypes.array,
    typesProduits: PropTypes.object,
    loadCommandes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { commandes, loadCommandes, relaiId, loadCommande, route } = this.props; // eslint-disable-line
    loadCommandes({ relaiId });
    // loadCommande('2cfdf815-3e1e-4223-87e2-c3022e596ee7');
  }

  getCommandeInfos = (id) => {
    const { produits, commandes, typesProduits, fournisseurs } = this.props;
    const commande = commandes[id];
    return commande.fournisseurs
      .filter((frnId) => fournisseurs.find((frn) => frn.id === frnId))
      .map((frnId) =>
          Object.keys(produits)
            .filter((pdtId) => produits[pdtId].visible)
            .find(
              (pdtId) => produits[pdtId].fournisseurId === frnId && produits[pdtId].visible
            ))
            .map((pdtId) => produits[pdtId].typeProduitId)
              .map((typePdtId) => typesProduits[typePdtId].nom);
  }

  commandeUtilisateurExiste = (commandeId) => {
    const { commandesUtilisateurs, utilisateurId } = this.props;
    return Object.keys(commandesUtilisateurs)
            .find((key) =>
            commandesUtilisateurs[key].utilisateurId === utilisateurId &&
            commandesUtilisateurs[key].commandeId === commandeId
          );
  }

  isInWeek = (dateCommande, weekOffset = 0) => {
    const debut = moment().add(weekOffset, 'w').startOf('week').startOf('day');
    const fin = moment().add(weekOffset, 'w').endOf('week').endOf('day');
    return moment(dateCommande).isAfter(moment()) &&
           moment(dateCommande).isBetween(debut, fin);
  }

  filterByWeek = (weekOffset = 0) =>
      Object.keys(this.props.commandes)
      .filter((key) =>
        !this.props.commandes[key].terminee && this.isInWeek(this.props.commandes[key].dateCommande, weekOffset)
      ).sort(
        (key) => !this.props.commandes[key].noCommande
      );

  render() {
    const { commandes, relaiId, pushState, pending, utilisateurId } = this.props;
    if (commandes && Object.keys(commandes).length > 0) {
      return (
        <div className="row">
          <Semainier
            titreCol="Cette semaine"
            commandesIds={this.filterByWeek()}
            commandes={commandes}
            getCommandeInfos={(key) => this.getCommandeInfos(key)}
            relaiId={relaiId}
            pushState={pushState}
            pending={pending}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={(commandeId) => this.commandeUtilisateurExiste(commandeId)}
          />
          <Semainier
            titreCol="La semaine prochaine"
            commandesIds={this.filterByWeek(1)}
            commandes={commandes}
            getCommandeInfos={(key) => this.getCommandeInfos(key)}
            relaiId={relaiId}
            pending={pending}
            pushState={pushState}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={(commandeId) => this.commandeUtilisateurExiste(commandeId)}
          />
          <Semainier
            titreCol="Dans quinze jours"
            commandesIds={this.filterByWeek(2)}
            commandes={commandes}
            relaiId={relaiId}
            pending={pending}
            getCommandeInfos={(key) => this.getCommandeInfos(key)}
            pushState={pushState}
            utilisateurId={utilisateurId}
            commandeUtilisateurExiste={(commandeId) => this.commandeUtilisateurExiste(commandeId)}
          />
          <div className="col-xs">
            <Panel>Dans 3 semaines</Panel>
            <Offre
              nom="Fromages & charcuterie"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav
            />
          </div>
        </div>
      );
    }

    if (!commandes) {
      return (
        <div className={`${styles.loader} row`}>
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
            <div style={{ margin: '40px auto', width: '300px', textAlign: 'center' }}>Chargement des commandes...</div>
          </Paper>
        </div>
      );
    }

    return (
      <div>
        <div className="row center-md">
          <div className="col-md-6">
            <Paper className={`${styles.noCommande}`}>
              {commandes && Object.keys(commandes).length === 0 && (<h2>Pas de commande en cours...</h2>)}
            </Paper>
          </div>
        </div>
      </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  commandes: selectCommandesRelais(),
  commandesUtilisateurs: selectCommandesUtilisateurs(),
  relaiId: selectRelaisId(),
  utilisateurId: selectAuthUtilisateurId(),
  produits: selectProduits(),
  fournisseurs: selectFournisseurs(),
  typesProduits: selectTypesProduits(),
  asyncState: selectAsyncState(),
  route: selectLocationState(),
  pending: selectPending(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadCommandes: (page) => dispatch(loadCommandes(page)),
    loadCommande: (id) => dispatch(loadCommande(id)),
    pushState: (url) => dispatch(push(url)),
    ajouter: (contenuId, qte) => dispatch(ajouter(contenuId, qte)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commande);
