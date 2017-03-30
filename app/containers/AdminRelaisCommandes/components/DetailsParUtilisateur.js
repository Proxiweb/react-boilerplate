import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import round from 'lodash/round';
import RaisedButton from 'material-ui/RaisedButton';
import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
  selectCommandeStellarAdresse,
  selectOffres,
} from 'containers/Commande/selectors';

import { selectUtilisateurStellarAdresse } from 'containers/AdminUtilisateurs/selectors';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
const format = 'DD/MM/YY à HH:mm';
import styles from './styles.css';
import DetailCommande from './DetailCommande';
import DetailCommandeTotal from './DetailCommandeTotal';
import CommandePaiementsUtilisateur from './CommandePaiementsUtilisateur';
import LivraisonCommande from './LivraisonCommande';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import StellarAccount from 'components/StellarAccount';

// eslint-disable-next-line
class DetailsParUtilisateur extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired,
    commandeUtilisateur: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    utilisateur: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    commandeStellarAdresse: PropTypes.string.isRequired,
    utilisateurStellarAdresse: PropTypes.string.isRequired,
    depots: PropTypes.array.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      account: null,
    };
  }

  handleAccountLoaded = account => {
    this.setState({ account });
  };

  render() {
    const {
      utilisateur,
      contenus,
      produits,
      params,
      roles,
      offres,
      commandeContenus,
      commandeUtilisateur,
      commande,
      utilisateurStellarAdresse,
      commandeStellarAdresse,
      pushState,
      depots,
    } = this.props;

    const { commandeId, relaiId, utilisateurId } = params;

    const contenusUtilisateur = commandeContenus
      .map(key => contenus[key])
      .filter(c => c.utilisateurId === utilisateur.id);

    const depot = depots.find(
      d => d.utilisateurId === utilisateurId && !d.transfertEffectue && d.type === 'depot_relais'
    );

    const totaux = calculeTotauxCommande({
      contenus: contenusUtilisateur,
      offres,
      commandeContenus,
      commandeId: params.commandeId,
    });
    const credit = parseFloat(this.state.account ? this.state.account.balance : 0) +
      (depot ? depot.montant : 0);
    const totalCommande = round(totaux.prix + totaux.recolteFond, 2);

    const paiementOk = this.state.account ? credit >= totalCommande : false;
    console.log(commandeUtilisateur);
    const identite = `${capitalize(utilisateur.prenom)} ${utilisateur.nom.toUpperCase()}`;
    return (
      <div className={`row center-md ${styles.detailsParUtilisateur}`}>
        <Helmet title={`Commande de ${identite}`} />
        <div className={`col-md-12 ${styles.etatCommandeUtilisateur}`}>
          <div className="row">
            <div className="col-md">
              <strong>
                {identite}
                {commandeUtilisateur.createdAt &&
                  ` passée le ${moment(commandeUtilisateur.createdAt).format(format)}`}
              </strong>
            </div>
            <div className="col-md">
              <div className="row arround-md">
                <div className="col-md">
                  {commandeUtilisateur.datePaiement
                    ? `Payée le ${moment(commandeUtilisateur.datePaiement).format(format)}`
                    : 'Non payée'}
                </div>
                <div className="col-md">
                  {commandeUtilisateur.dateLivraison
                    ? `Livrée le ${moment(commandeUtilisateur.dateLivraison).format(format)}`
                    : 'Non livrée'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <DetailCommande
            contenus={contenusUtilisateur}
            commandeContenus={commandeContenus.map(key => contenus[key])}
            produits={produits}
            commandeId={params.commandeId}
            offres={offres}
            roles={roles}
          />
          <DetailCommandeTotal totaux={totaux} />
          {false &&
            <CommandePaiementsUtilisateur
              adresseStellarUtilisateur={utilisateurStellarAdresse}
              adresseStellarCommande={commandeStellarAdresse}
            />}
        </div>
        {!commandeUtilisateur.dateLivraison &&
          paiementOk &&
          <LivraisonCommande commandeUtilisateur={commandeUtilisateur} />}
        {!commandeUtilisateur.datePaiement &&
          moment(commande.dateCommande).isAfter(moment()) &&
          <div className="col-md-12" style={{ marginTop: '1em' }}>
            <div className="row center-md">
              <div className="col-md-4">
                <RaisedButton
                  fullWidth
                  primary
                  label="Modifier"
                  onClick={() =>
                    pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`)}
                />
              </div>
              <div className="col-md-4">
                <RaisedButton
                  fullWidth
                  secondary
                  label="Annuler"
                  onClick={() =>
                    pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`)}
                />
              </div>
            </div>
          </div>}
        <div className="col-md-6" style={{ marginTop: '1em' }}>
          {utilisateur.stellarKeys &&
            <StellarAccount
              stellarAdr={utilisateur.stellarKeys.adresse}
              onAccountLoaded={this.handleAccountLoaded}
            />}
          {!utilisateur.stellarKeys && <h3>Pas de compte</h3>}
        </div>
        <div className="col-md-6" style={{ marginTop: '1em' }}>
          <h3>
            {this.state.account && !paiementOk && <p>Manque {round(totalCommande - credit, 2)} €</p>}
            {this.state.account && paiementOk && <p>Restera {round(credit - totalCommande, 2)} €</p>}
          </h3>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  offres: selectOffres(),
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
  utilisateurStellarAdresse: selectUtilisateurStellarAdresse(),
  commandeStellarAdresse: selectCommandeStellarAdresse(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParUtilisateur);
