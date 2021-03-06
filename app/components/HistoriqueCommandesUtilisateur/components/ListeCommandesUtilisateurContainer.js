import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { format } from 'utils/dates';

import { List, ListItem, makeSelectable } from 'material-ui/List';
import {
  makeSelectCommandes,
  makeSelectCommandesUtilisateurs,
} from 'containers/Commande/selectors';

import { loadUserCommandes } from 'containers/Commande/actions';

const SelectableList = makeSelectable(List);

class ListeCommandesUtilisateurContainer extends Component {
  // eslint-disable-line
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    commandeSelected: PropTypes.string,
    commandes: PropTypes.object,
    commandeUtilisateurs: PropTypes.object,

    loadCommandesUtilisateur: PropTypes.func.isRequired,
    onSelectCommande: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { utilisateurId, loadCommandesUtilisateur } = this.props;
    loadCommandesUtilisateur(utilisateurId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.utilisateurId !== nextProps.utilisateurId) {
      this.props.loadCommandesUtilisateur(nextProps.utilisateurId);
    }
  }

  render() {
    const { commandeSelected, utilisateurId } = this.props;

    const commandeUtilisateurs = this.props.commandeUtilisateurs
      ? Object.keys(this.props.commandeUtilisateurs)
          .filter(
            id =>
              this.props.commandeUtilisateurs[id].utilisateurId ===
              utilisateurId
          )
          .map(id => this.props.commandeUtilisateurs[id])
      : [];

    const commandes = this.props.commandes
      ? Object.keys(this.props.commandes)
          .filter(id => commandeUtilisateurs.find(cu => cu.commandeId === id))
          .map(key => this.props.commandes[key])
      : null;

    if (!commandes) return null;

    return (
      <SelectableList
        value={commandeSelected}
        onChange={this.props.onSelectCommande}
      >
        {commandes.map((cde, idx) =>
          (<ListItem
            key={idx}
            primaryText={format(cde.dateCommande, 'DD MMMM')}
            value={cde.id}
          />)
        )}
      </SelectableList>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandes: makeSelectCommandes(),
  commandeUtilisateurs: makeSelectCommandesUtilisateurs(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandesUtilisateur: loadUserCommandes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  ListeCommandesUtilisateurContainer
);
