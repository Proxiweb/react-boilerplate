import React, { Component } from 'react'; import PropTypes from 'prop-types';
import round from 'lodash/round';
import styles from './styles.css';

export default class DetailCommandeTotal extends Component {
  // eslint-disable-line
  static propTypes = {
    totaux: PropTypes.object.isRequired,
  };

  render() {
    const { totaux } = this.props;
    return (
      <div className={styles.totalCommande}>
        <span className={styles.total}>{totaux.prix.toFixed(2)} + {totaux.recolteFond.toFixed(2)}</span>
        <span className={styles.recolteFond}>
          {' = '} <strong>{round(totaux.recolteFond + totaux.prix, 2)}</strong> €
        </span>
      </div>
    );
  }
}
