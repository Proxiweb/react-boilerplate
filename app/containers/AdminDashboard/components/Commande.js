import React, { PropTypes, Component } from 'react';
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
    utilisateur: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    commandeUtilisateur: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object,
    commandeUtilisateurId: PropTypes.string.isRequired,
    offres: PropTypes.object,
  };

  // contenus: PropTypes.array.isRequired,
  // offres: PropTypes.object.isRequired,
  // commandeContenus: PropTypes.object.isRequired,
  // commandeId: PropTypes.string,
  // produits: PropTypes.object.isRequired,
  // diminuer: PropTypes.func,
  // augmenter: PropTypes.func,
  // readOnly: PropTypes.bool,
  // panierExpanded: PropTypes.bool.isRequired,

  render() {
    const {
      offres,
      produits,
      commandeUtilisateur,
      commandeContenus,
      commandeUtilisateurId,
      utilisateur,
      pending,
      onClick,
    } = this.props;

    console.log(commandeUtilisateurId);

    return (
      <Panel
        title={
          commandeUtilisateur
            ? `Commande du ${moment(commandeUtilisateur.createdAt).format(
                'LLL',
              )}`
            : 'Sélectionnez un utilisateur'
        }
      >
        <DetailCommande
          produits={produits}
          commandeContenus={commandeContenus}
          contenus={Object.keys(commandeContenus)
            .filter(
              key =>
                commandeContenus[key].commandeUtilisateurId ===
                  commandeUtilisateurId,
            )
            .map(key => commandeContenus[key])}
          offres={offres}
          commandeId={commandeUtilisateur.commandeId}
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
