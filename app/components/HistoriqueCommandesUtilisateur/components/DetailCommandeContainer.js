import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';

import DetailCommande from 'components/DetailCommande';
import { loadCommandes } from 'containers/Commande/actions';

import {
  makeSelectProduits,
  makeSelectOffres,
  makeSelectCommandesUtilisateurs,
  makeSelectCommandeContenus,
} from 'containers/Commande/selectors';

class DetailCommandeContainer extends Component {
  static propTypes = {
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,

    produits: PropTypes.object,
    offres: PropTypes.object,
    commandesUtilisateurs: PropTypes.object,
    contenus: PropTypes.object,

    loadCommandeById: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (!this.isLoaded(this.props)) {
      this.props.loadCommandeById({ id: this.props.commandeId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.commandeId !== nextProps.commandeId ||
      this.props.utilisateurId !== nextProps.utilisateurId
    ) {
      if (!this.isLoaded(nextProps)) {
        this.props.loadCommandeById({ id: nextProps.commandeId });
      }
    }
  }

  isLoaded = props => {
    const {
      commandesUtilisateurs,
      commandeId,
      utilisateurId,
      contenus,
    } = props;

    if (!commandesUtilisateurs || !contenus) return false;

    const commandeUtilisateurId = Object.keys(commandesUtilisateurs).find(
      id =>
        commandesUtilisateurs[id].commandeId === commandeId &&
        commandesUtilisateurs[id].utilisateurId === utilisateurId
    );

    return (
      commandeUtilisateurId &&
      Object.keys(contenus).filter(
        id => contenus[id].commandeUtilisateurId === commandeUtilisateurId
      ).length > 0
    );
  };

  render() {
    const {
      commandeId,
      utilisateurId,
      produits,
      offres,
      commandesUtilisateurs,
      contenus,
      pending,
    } = this.props;

    if (pending) {
      return (
        <RefreshIndicator
          size={40}
          left={0}
          top={10}
          status="loading"
          style={{ display: 'inline-block', position: 'relative' }}
        />
      );
    }

    const commandeUtilisateur = commandesUtilisateurs
      ? commandesUtilisateurs[
          Object.keys(commandesUtilisateurs).find(
            id =>
              commandesUtilisateurs[id].commandeId === commandeId &&
              commandesUtilisateurs[id].utilisateurId === utilisateurId
          )
        ]
      : null;

    if (!commandeUtilisateur || !contenus || !produits || !offres) return null;
    const commandeContenus = Object.keys(contenus)
      .filter(id => contenus[id].commandeId === commandeId)
      .reduce((m, id) => ({ ...m, [id]: contenus[id] }), {});

    // const contenusUtilisateur = Object.keys(contenus)
    //   .filter(
    //     id => contenus[id].commandeUtilisateurId === commandeUtilisateur.id,
    //   )
    //   .map(id => contenus[id]);

    return (
      <DetailCommande
        commandeContenus={commandeContenus}
        commandeId={commandeId}
        offres={offres}
        produits={produits}
        readOnly
        utilisateurId={utilisateurId}
        filter={cc => {
          const test = cc.commandeUtilisateurId === commandeUtilisateur.id;
          return test;
        }}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  produits: makeSelectProduits(),
  offres: makeSelectOffres(),
  contenus: makeSelectCommandeContenus(),
  commandesUtilisateurs: makeSelectCommandesUtilisateurs(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandeById: loadCommandes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  DetailCommandeContainer
);
