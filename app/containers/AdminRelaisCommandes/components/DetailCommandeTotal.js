import React, { PropTypes, Component } from 'react';
import styles from './styles.css';

export default class DetailCommandeTotal extends Component { // eslint-disable-line
  static propTypes = {
    total: PropTypes.number.isRequired,
    recolteFond: PropTypes.number.isRequired,
  }

  render() {
    const { total, recolteFond } = this.props;
    return (<div className={styles.totalCommande}>
      <span className={styles.total}>Total <strong>{total + recolteFond} €</strong></span>
      <span className={styles.recolteFond}> dont <strong>{recolteFond}</strong> € pour la distribution</span>
    </div>);
  }
}
