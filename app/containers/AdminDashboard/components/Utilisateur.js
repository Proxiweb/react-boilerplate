import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import Panel from './Panel';

import {
  loadCommandeUtilisateurs,
  loadFournisseurs,
} from 'containers/Commande/actions';
import {
  selectCommandesUtilisateurs,
  selectCommandeContenus,
  selectOffres,
  selectProduits,
} from 'containers/Commande/selectors';

import styles from './styles.css';

class Utilisateur extends Component {
  static propTypes = {
    utilisateur: PropTypes.object,
    commandeUtilisateurs: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    loadCommandeUtilisateurs: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
  };

  state = {
    fournisseursLoaded: {},
  };

  componentWillReceiveProps(nextProps) {
    const newProps = nextProps.utilisateur &&
      this.props.utilisateur &&
      this.props.utilisateur.id !== nextProps.utilisateur.id;
    if (!this.props.utilisateur || newProps) {
      this.props.loadCommandeUtilisateurs({
        utilisateurId: nextProps.utilisateur.id,
      });

      if (!this.state.fournisseursLoaded[nextProps.utilisateur.relaiId]) {
        this.props.loadFournisseurs({
          relaiId: nextProps.utilisateur.relaiId,
          jointures: true,
        });
        this.setState({
          fournisseursLoaded: {
            ...this.fournisseursLoaded,
            [nextProps.utilisateur.relaiId]: true,
          },
        });
      }
    }
  }

  render() {
    const {
      offres,
      produits,
      commandeUtilisateurs,
      commandeContenus,
      utilisateur,
    } = this.props;

    console.log(offres, produits, commandeUtilisateurs, commandeContenus);

    return (
      <Panel
        title={
          utilisateur
            ? `${utilisateur.nom.toUpperCase()}`
            : 'Sélectionnez un utilisateur'
        }
      >
        <p>
          {utilisateur &&
            `${utilisateur.nom.toUpperCase()} ${capitalize(
              utilisateur.prenom,
            )}`}
        </p>
        {commandeUtilisateurs &&
          Object.keys(commandeUtilisateurs)
            .filter(
              id => commandeUtilisateurs[id].utilisateurId === utilisateur.id,
            )
            .map(id => (
              <li>
                {moment(commandeUtilisateurs[id].createdAt).format('LLL')}
              </li>
            ))}
      </Panel>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeContenus: selectCommandeContenus(),
  commandeUtilisateurs: selectCommandesUtilisateurs(),
  offres: selectOffres(),
  produits: selectProduits(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loadCommandeUtilisateurs,
    loadFournisseurs,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Utilisateur);
