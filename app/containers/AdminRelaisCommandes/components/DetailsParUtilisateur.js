import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
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
import { calculeTotauxCommande } from 'containers/Commande/utils';

class DetailsParUtilisateur extends Component { // eslint-disable-line
  static propTypes = {
    commandeUtilisateur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    utilisateur: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    commandeStellarAdresse: PropTypes.string.isRequired,
    utilisateurStellarAdresse: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  render() {
    const {
      utilisateur,
      contenus,
      produits,
      params,
      offres,
      commandeContenus,
      commandeUtilisateur,
      utilisateurStellarAdresse,
      commandeStellarAdresse,
      pushState,
    } = this.props;

    const { commandeId, relaiId, utilisateurId } = params;

    const contenusUtilisateur = commandeContenus.map((key) => contenus[key]).filter((c) => c.utilisateurId === utilisateur.id);
    const totaux = calculeTotauxCommande({ contenus: contenusUtilisateur, offres, commandeContenus, commandeId: params.commandeId });
    const identite = `${capitalize(utilisateur.prenom)} ${utilisateur.nom.toUpperCase()}`;
    return (
      <div className="row">
        <Helmet
          title={`Commande de ${identite}`}
        />
        <div className={`col-md-12 ${styles.etatCommandeUtilisateur}`}>
          <div className="row">
            <div className="col-md">
              <strong>{identite}</strong>
            </div>
            <div className="col-md">
              <div className="row arround-md">
                <div className="col-md">
                  { commandeUtilisateur.datePaiement ?
                    `Payée le ${moment(commandeUtilisateur.datePaiement).format(format)}` :
                    'Non payée'}
                </div>
                <div className="col-md">
                  { commandeUtilisateur.dateLivraison ?
                    `Livrée le ${moment(commandeUtilisateur.datePaiement).format(format)}` :
                    'Non livrée'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <DetailCommande
            contenus={contenusUtilisateur}
            commandeContenus={commandeContenus.map((key) => contenus[key])}
            produits={produits}
            commandeId={params.commandeId}
            offres={offres}
          />
          <DetailCommandeTotal totaux={totaux} />
          {false && <CommandePaiementsUtilisateur
            adresseStellarUtilisateur={utilisateurStellarAdresse}
            adresseStellarCommande={commandeStellarAdresse}
          />}
        </div>
        {!commandeUtilisateur.datePaiement &&
          <div className="col-md-12" style={{ marginTop: '1em' }}>
            <div className="row center-md">
              <div className="col-md-4">
                <RaisedButton
                  fullWidth
                  primary
                  label="Modifier"
                  onClick={
                    () => pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`)
                  }
                />
              </div>
              <div className="col-md-4">
                <RaisedButton
                  fullWidth
                  secondary
                  label="Annuler"
                  onClick={
                    () => pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`)
                  }
                />
              </div>
            </div>
          </div>
        }
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

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParUtilisateur);
