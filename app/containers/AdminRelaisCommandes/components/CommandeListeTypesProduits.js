import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import { createStructuredSelector } from 'reselect';
import {
  selectTypesProduits,
  selectFournisseursIds,
  selectProduits,
} from 'containers/Commande/selectors';

import styles from './styles.css';

class CommandeListeTypesProduits extends Component {
  static propTypes = {
    commande: PropTypes.object.isRequired,
    typesProduits: PropTypes.object,
    produits: PropTypes.object,
    fournisseurs: PropTypes.object,
  }

  render() {
    const { fournisseurs, produits, typesProduits, commande } = this.props;
    if (!fournisseurs || !produits || !typesProduits) return null;
    const types = uniq(
      commande
        .fournisseurs
        .filter((id) => fournisseurs[id].visible)
        .reduce((memo, fId) =>
          memo.concat(
            Object.keys(produits)
              .filter((id) => produits[id].fournisseurId === fId)
        ), [])
        .map((pdtId) => produits[pdtId].typeProduitId)
    ).map((typeProduitId) => typesProduits[typeProduitId].nom).join(', ');

    return <div className={styles.typesProduits}>{types}</div>;
  }
}

const mapStateToProps = createStructuredSelector({
  typesProduits: selectTypesProduits(),
  produits: selectProduits(),
  fournisseurs: selectFournisseursIds(),
});

export default connect(mapStateToProps)(CommandeListeTypesProduits);
