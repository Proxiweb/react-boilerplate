import React, { PropTypes, Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import capitalize from 'lodash/capitalize';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import api from 'utils/stellarApi';

import {
  selectFournisseursCommande,
  selectCommandeProduits,
  selectOffres,
} from 'containers/Commande/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

import styles from './styles.css';

// eslint-disable-next-line
class ValidationCommande extends Component {
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    commandeUtilisateurs: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    handleValidate: PropTypes.func.isRequired,
  };

  state = {
    index: 0,
  };

  componentDidMount = () => {
    this.timer = setTimeout(() => this.progress(), 3000);
  };

  progress() {
    const {
      commandeUtilisateurs,
      utilisateurs,
    } = this.props;
    const utilisateur = utilisateurs.find(u => u.id === commandeUtilisateurs[this.state.index].utilisateurId);
    // api
    //   .pay({
    //     destination: utilisateur.stellarKeys.adresse,
    //     currency: 'PROXI',
    //     currencyIssuer: stellarKeys.adresse,
    //     amount: montant,
    //     stellarKeys,
    //   })
    //   .then(transactionHash => {
    //     this.props.onDepotDirectSuccess();
    //     this.setState({ ...this.state, depotEnCours: false, depotOk: true });
    //     deposer({
    //       utilisateurId: utilisateur.id,
    //       montant,
    //       type: 'depot_direct',
    //       infosSupplement: {
    //         ...info,
    //         type,
    //         transactionHash,
    //       },
    //       transfertEffectue: true,
    //     });
    //   });
    if (this.state.index < 3) {
      this.setState({ index: this.state.index + 1 });
      this.timer = setTimeout(() => this.progress(), 3000);
    }
  }

  render() {
    const {
      commandeContenus,
      contenus,
      produits,
      commandeUtilisateurs,
      offres,
      params,
      utilisateurs,
      auth,
    } = this.props;

    const { index } = this.state;
    console.log(this.state);
    // const validees = commandeUtilisateurs.filter(cu => cu.datePaiement).length;
    let message;
    if (commandeUtilisateurs[index]) {
      const utilisateur = utilisateurs.find(u => u.id === commandeUtilisateurs[index].utilisateurId);
      message = `Validation paiement ${utilisateur.nom.toUpperCase()} ${capitalize(utilisateur.prenom)}`;
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
                value={this.state.index + 1}
                min={0}
                max={commandeUtilisateurs.length}
              />
            </div>
            <div className={`col-md-12 ${styles.mT}`}>
              {index < commandeUtilisateurs.length - 1 &&
                <RaisedButton label="Effectuer les paiements" primary />}
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
});

export default connect(mapStateToProps)(ValidationCommande);
