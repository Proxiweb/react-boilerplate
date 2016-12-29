import React, { PropTypes, Component } from 'react';
import round from 'lodash/round';
import styles from './styles.css';

export default class DetailCommandeTotal extends Component { // eslint-disable-line
  static propTypes = {
    totaux: PropTypes.object.isRequired,
  }

  render() {
    const { totaux } = this.props;
    return (<div className={styles.totalCommande}>
      <span className={styles.total}>Total <strong>{totaux.prix.toFixed(2)} €</strong></span>
      <span className={styles.recolteFond}> dont <strong>{round(totaux.recolteFond, 2)}</strong> € pour la distribution</span>
    </div>);
  }
}
