import React, { Component } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

export default class Adresse extends Component {
  // eslint-disable-line
  static propTypes = {
    datas: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    const { datas: d, label } = this.props;
    return (
      <div>
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
