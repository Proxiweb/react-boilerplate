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
      <span className={styles.total}>Total <strong>{totaux.prix} €</strong></span>
      <span className={styles.recolteFond}> dont <strong>{totaux.recolteFond}</strong> € pour la distribution</span>
    </div>);
  }
}
