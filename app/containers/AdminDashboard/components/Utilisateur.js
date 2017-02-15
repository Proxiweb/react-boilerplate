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
    utilisateur: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    commandeUtilisateurs: PropTypes.object,
    commandeContenus: PropTypes.object,
    offres: PropTypes.object,
    produits: PropTypes.object,
    loadCommandeUtilisateurs: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
  };

  state = {
    fournisseursLoaded: {},
    utilisateursCommandesLoaded: {},
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.utilisateur.id !== nextProps.utilisateur.id) {
      const fLoaded = {};
      const cLoaded = {};
      if (!this.state.utilisateursCommandesLoaded[nextProps.utilisateur.id]) {
        this.props.loadCommandeUtilisateurs({
          utilisateurId: nextProps.utilisateur.id,
        });
        cLoaded[nextProps.utilisateur.id] = true;
      }

      if (!this.state.fournisseursLoaded[nextProps.utilisateur.relaiId]) {
        this.props.loadFournisseurs({
          relaiId: nextProps.utilisateur.relaiId,
          jointures: true,
        });
        fLoaded[nextProps.utilisateur.relaiId] = true;
      }

      this.setState({
        fournisseursLoaded: {
          ...this.state.fournisseursLoaded,
          ...fLoaded,
        },
        utilisateursCommandesLoaded: {
          ...this.state.utilisateursCommandesLoaded,
          ...cLoaded,
        },
      });
    }
  }

  render() {
    const {
      offres,
      produits,
      commandeUtilisateurs,
      commandeContenus,
      utilisateur,
      pending,
    } = this.props;

    return (
      <Panel
        title={
          utilisateur
            ? `${utilisateur.nom.toUpperCase()} ${capitalize(
                utilisateur.prenom,
              )}`
            : 'Sélectionnez un utilisateur'
        }
      >
        {pending && <p>Chargement...</p>}
        {!pending &&
          commandeUtilisateurs &&
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
