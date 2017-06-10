/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import api from "utils/stellarApi";

import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectOffres,
  selectCommandeCommandeUtilisateurs
} from "containers/Commande/selectors";

import { selectUtilisateurs } from "containers/AdminUtilisateurs/selectors";
import round from "lodash/round";
import classnames from "classnames";
import capitalize from "lodash/capitalize";

class AdminFinalisationCommande extends Component {
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    depots: PropTypes.array,
    offres: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired
  };

  state = {
    paiements: {},
    totaux: {},
    utilisateurSelected: null
  };

  render() {
    const { commandeUtilisateurs, utilisateurs, params, depots } = this.props;

    return (
      <div className="row">
        <div className={classnames("col-md-8 col-md-2", styles.panel)} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  utilisateurs: selectUtilisateurs(),
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  offres: selectOffres()
});

export default connect(mapStateToProps)(AdminFinalisationCommande);

/* eslint-enable */
