import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import { createStructuredSelector } from "reselect";

import { selectCommandeId } from "containers/Commande/selectors";
import { selectUserId } from "containers/CompteUtilisateur/selectors";

import HistoriqueCommandesUtilisateur from "components/HistoriqueCommandesUtilisateur";

class HistoriqueCommandes extends Component {
  // eslint-disable-line
  static propTypes = {
    userId: PropTypes.string.isRequired,
    commandeId: PropTypes.string,
    params: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleChangeList = (event, value) =>
    this.props.pushState(`/users/${this.props.params.userId}/commandes/${value}`);

  render() {
    const { commandeId, userId } = this.props;
    return (
      <HistoriqueCommandesUtilisateur
        utilisateurId={userId}
        commandeId={commandeId}
        onSelectCommande={this.handleChangeList}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userId: selectUserId(),
  commandeId: selectCommandeId()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HistoriqueCommandes);
