import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
    } = this.props;

    const contenusUtilisateur = commandeContenus.map((key) => contenus[key]).filter((c) => c.utilisateurId === utilisateur.id);
    const totaux = calculeTotauxCommande({ contenus: contenusUtilisateur, offres, commandeContenus, commandeId: params.commandeId });
    return (
      <div className="row">
        <div className={`col-md-12 ${styles.etatCommandeUtilisateur}`}>
          <div className="row">
            <div className="col-md">
              <strong>{capitalize(utilisateur.prenom)} {utilisateur.nom.toUpperCase()}</strong>
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

export default connect(mapStateToProps)(DetailsParUtilisateur);
