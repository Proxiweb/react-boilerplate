import React, { Component, PropTypes } from 'react';
import HistoriqueCommandesUtilisateur from 'components/HistoriqueCommandesUtilisateur';

export default class HistoriqueCommandes extends Component {
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
  };

  state = {
    commandeId: null,
  };

  handleSelect = (event, value) => this.setState({ commandeId: value });

  render() {
    const { utilisateurId } = this.props;
    const { commandeId } = this.state;
    return (
      <HistoriqueCommandesUtilisateur
        utilisateurId={utilisateurId}
        commandeId={commandeId}
        onSelectCommande={this.handleSelect}
      />
    );
  }
}
