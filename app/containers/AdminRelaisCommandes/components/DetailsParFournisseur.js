import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import { calculeTotauxCommande } from 'containers/Commande/utils';

import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
  selectOffres,
} from 'containers/Commande/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

import CommandeFournisseur from './CommandeFournisseur';
import CommandeDistributeur from './CommandeDistributeur';
import FournisseurToolbar from './FournisseurToolbar';
import styles from './styles.css';

// eslint-disable-next-line
class DetailsParFournisseur extends Component {
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  render() {
    const {
      commandeContenus,
      contenus,
      produits,
      fournisseurs,
      offres,
      params,
      auth,
      pushState,
    } = this.props;

    const { commandeId } = params;
    const totaux = calculeTotauxCommande({
      contenus: Object.keys(contenus).map(key => contenus[key]).filter(c => c.commandeId === commandeId),
      offres,
      commandeContenus,
      commandeId,
    });

    return (
      <div className={`row ${styles.detailsParFournisseur}`}>
        {(includes(auth.roles, 'ADMIN') || includes(auth.roles, 'RELAI_ADMIN')) &&
          <FournisseurToolbar role={auth.roles} pushState={pushState} />}
        <div className={`col-md-6 ${styles.totalDistrib}`}>
          Total Commande:{' '}
          <strong>{parseFloat(totaux.prix).toFixed(2)} €</strong>
        </div>
        <div className={`col-md-6 ${styles.totalDistrib}`}>
          Total Distributeur:{' '}
          <strong>{parseFloat(totaux.recolteFond).toFixed(2)} €</strong>
        </div>
        <div className={`col-md-12 ${styles.listeCommandes}`}>
          {fournisseurs.filter(f => f.visible).map((fournisseur, idx) => {
            const pdts = produits.filter(pdt => pdt.fournisseurId === fournisseur.id);
            return (
              <div className="col-md-12">
                <CommandeFournisseur
                  key={idx}
                  fournisseur={fournisseur}
                  produits={pdts}
                  commandeContenus={commandeContenus}
                  contenus={contenus}
                  offres={offres}
                  commandeId={commandeId}
                />
              </div>
            );
          })}
          <CommandeDistributeur
            key={'1x'}
            fournisseur={fournisseurs[0]}
            produits={produits}
            commandeContenus={commandeContenus}
            contenus={contenus}
            offres={offres}
            commandeId={commandeId}
            noFiltre
          />
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
  offres: selectOffres(),
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    pushState: push,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParFournisseur);
