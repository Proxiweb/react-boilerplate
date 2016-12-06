import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
} from 'containers/Commande/selectors';
import capitalize from 'lodash.capitalize';
import moment from 'moment';
const format = 'DD/MM/YY à HH:mm';
import styles from './styles.css';
import DetailCommande from './DetailCommande';
import DetailCommandeTotal from './DetailCommandeTotal';

class DetailsParUtilisateur extends Component { // eslint-disable-line
  static propTypes = {
    commandeUtilisateur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    utilisateur: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
  }

  render() {
    const { utilisateur, contenus, produits, commandeContenus, commandeUtilisateur } = this.props;
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
                  { commandeUtilisateur.datePaiement ?
                    `Livrée le ${moment(commandeUtilisateur.datePaiement).format(format)}` :
                    'Non livrée'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <DetailCommande
            contenus={commandeContenus.map((key) => contenus[key]).filter((c) => c.utilisateurId === utilisateur.id)}
            produits={produits}
            commandeUtilisateur={commandeUtilisateur}
          />
        <DetailCommandeTotal total={commandeUtilisateur.montant} recolteFond={commandeUtilisateur.recolteFond} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
});

export default connect(mapStateToProps)(DetailsParUtilisateur);
