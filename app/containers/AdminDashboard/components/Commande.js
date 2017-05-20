import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import Panel from './Panel';

import {
  selectCommandeContenus,
  selectOffres,
  selectProduits,
} from 'containers/Commande/selectors';

import DetailCommande from 'components/DetailCommande';

import styles from './styles.css';

class Commande extends Component {
  static propTypes = {
    commandeUtilisateur: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object,
    commandeUtilisateurId: PropTypes.string.isRequired,
    offres: PropTypes.object,
  };

  render() {
    const {
      offres,
      produits,
      commandeUtilisateur,
      commandeContenus,
      commandeUtilisateurId,
    } = this.props;

    return (
      <Panel
        title={
          commandeUtilisateur
            ? `Commande du ${moment(commandeUtilisateur.createdAt).format('LLL')}`
            : 'Sélectionnez un utilisateur'
        }
      >
        <DetailCommande
          produits={produits}
          commandeContenus={commandeContenus}
          offres={offres}
          filter={cc => cc.commandeUtilisateurId === commandeUtilisateurId}
          commandeId={commandeUtilisateur.commandeId}
          readOnly
          utilisateurId={commandeUtilisateur.utilisateurId}
        />
      </Panel>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeContenus: selectCommandeContenus(),
  offres: selectOffres(),
  produits: selectProduits(),
});
export default connect(mapStateToProps)(Commande);
