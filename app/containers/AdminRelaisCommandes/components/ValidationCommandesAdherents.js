import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import capitalize from 'lodash/capitalize';
import round from 'lodash/round';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import { createStructuredSelector } from 'reselect';
import { selectStellarKeys } from 'containers/App/selectors';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import api from 'utils/stellarApi';

import {
  selectFournisseursCommande,
  selectCommandeProduits,
  selectCommande,
  selectOffres,
} from 'containers/Commande/selectors';

import { payerCommandeUtilisateur } from 'containers/Commande/actions';

import {
  selectCompteUtilisateur,
} from 'containers/CompteUtilisateur/selectors';

import styles from './styles.css';

// eslint-disable-next-line
class ValidationCommandesAdherents extends Component {
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    commandeUtilisateurs: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    stellarKeys: PropTypes.object.isRequired,
    payerCommandeUtilisateur: PropTypes.func.isRequired,
  };

  state = {
    index: 0,
    paiementEnCours: null,
  };

  pay = () => {
    const {
      commandeUtilisateurs,
      commandeContenus,
      utilisateurs,
      contenus,
      commande,
      stellarKeys: { adresse },
      offres,
      params: { commandeId },
    } = this.props;

    if (commandeUtilisateurs[this.state.index].datePaiement) {
      const cdu = commandeUtilisateurs[this.state.index];
      this.setState({
        ...this.state,
        paiementEnCours: `Déja payé ${round(cdu.montant + cdu.recolteFond, 2)}`,
      });
      setTimeout(() => {
        const index = this.state.index + 1;
        this.setState({ ...this.state, index, paiementEnCours: null });

        if (index < Object.keys(commandeUtilisateurs).length) {
          this.pay();
        }
      }, 1000);
    } else {
      const utilisateurCourant =
        commandeUtilisateurs[this.state.index].utilisateurId;
      const contenusUtilisateur = Object.keys(contenus)
        .filter(
          id =>
            contenus[id].utilisateurId === utilisateurCourant &&
            contenus[id].commandeId === commandeId
        )
        .map(id => contenus[id]);

      const utilisateur = utilisateurs.find(u => u.id === utilisateurCourant);

      const { prix, recolteFond } = calculeTotauxCommande({
        offres,
        commandeContenus: contenusUtilisateur,
        commandeId,
      });

      this.setState({
        ...this.state,
        paiementEnCours: (prix + recolteFond).toFixed(2),
      });

      api
        .pay({
          destination: commande.stellarKeys.adresse,
          currency: 'PROXI',
          currencyIssuer: adresse,
          amount: round(parseFloat(prix + recolteFond), 2).toString(),
          stellarKeys: utilisateur.stellarKeys,
        })
        .then(({ hash }) => {
          this.props.payerCommandeUtilisateur({
            ...commandeUtilisateurs[this.state.index],
            montant: round(parseFloat(prix), 2),
            recolteFond: parseFloat(recolteFond),
            transactionHash: hash,
          });
          const index = this.state.index + 1;
          this.setState({ ...this.state, index, paiementEnCours: null });

          if (index < Object.keys(commandeUtilisateurs).length) {
            this.pay();
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({
            ...this.state,
            index,
            paiementEnCours: 'Non effectué !',
          });
          const index = this.state.index + 1;
          setTimeout(() => {
            this.setState({ ...this.state, index, paiementEnCours: null });
          }, 3000);
        });
    }
  };

  render() {
    const { commandeUtilisateurs, utilisateurs } = this.props;

    const { index, paiementEnCours } = this.state;
    // const validees = commandeUtilisateurs.filter(cu => cu.datePaiement).length;
    let message;
    if (commandeUtilisateurs[index]) {
      const utilisateur = utilisateurs.find(
        u => u.id === commandeUtilisateurs[index].utilisateurId
      );
      message = `Validation paiement ${utilisateur.nom.toUpperCase()} ${capitalize(utilisateur.prenom)}${paiementEnCours !== null ? ` - ${paiementEnCours} € ...` : ''}`;
    } else {
      message = 'Terminé !';
    }
    return (
      <div className="row center-md">
        <div className={`col-md-10 ${styles.validation}`}>
          <div className="row">
            <div className="col-md-12">{message}</div>
            <div className={`col-md-12 ${styles.mT}`}>
              <LinearProgress
                mode="determinate"
                value={this.state.index}
                min={0}
                max={commandeUtilisateurs.length}
              />
            </div>
            <div className={`col-md-12 ${styles.mT}`}>
              {index < commandeUtilisateurs.length &&
                <RaisedButton
                  label="Effectuer les paiements"
                  primary
                  onClick={this.pay}
                />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
  offres: selectOffres(),
  auth: selectCompteUtilisateur(),
  stellarKeys: selectStellarKeys(),
  commande: selectCommande(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ payerCommandeUtilisateur }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(
  ValidationCommandesAdherents
);
