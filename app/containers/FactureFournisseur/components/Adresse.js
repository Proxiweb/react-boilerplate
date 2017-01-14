import React, { PropTypes, Component } from 'react';
import capitalize from 'lodash/capitalize';
import styles from './styles.css';

export default class Adresse extends Component { // eslint-disable-line
  static propTypes = {
    datas: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
  }

  render() {
    const { datas: d, label } = this.props;
    return (
      <div className={styles.adresse}>
        <strong>{label}</strong><br />
        {d.nom.toUpperCase()} {d.prenom && capitalize(d.prenom)}<br />
        {d.adresse}<br />
        {d.adresseComplementaire ? d.adresseComplementaire : ''}
        {d.adresseComplementaire ? <br /> : ''}
        {d.codePostal} {d.ville.toUpperCase()}
      </div>
    );
  }
}
