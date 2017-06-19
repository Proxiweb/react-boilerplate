import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectTypesProduits,
  makeSelectFournisseursIds,
  makeSelectProduits,
} from 'containers/Commande/selectors';

import styles from './styles.css';

class CommandeListeTypesProduits extends Component {
  static propTypes = {
    commande: PropTypes.object.isRequired,
    typesProduits: PropTypes.object,
    produits: PropTypes.object,
    fournisseurs: PropTypes.object,
  };

  render() {
    const { fournisseurs, produits, typesProduits, commande } = this.props;
    if (!fournisseurs || !produits || !typesProduits) return null;
    const types = uniq(
      commande.datesLimites
        .filter(dL => fournisseurs[dL.fournisseurId].visible)
        .reduce(
          (memo, dL) =>
            memo.concat(
              Object.keys(produits).filter(
                id => produits[id].fournisseurId === dL.fournisseurId
              )
            ),
          []
        )
        .map(pdtId => produits[pdtId].typeProduitId)
    )
      .map(typeProduitId => typesProduits[typeProduitId].nom)
      .join(', ');

    return <div className={styles.typesProduits}>{types}</div>;
  }
}

const mapStateToProps = createStructuredSelector({
  typesProduits: makeSelectTypesProduits(),
  produits: makeSelectProduits(),
  fournisseurs: makeSelectFournisseursIds(),
});

export default connect(mapStateToProps)(CommandeListeTypesProduits);
