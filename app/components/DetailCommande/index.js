import React, { Component, PropTypes } from 'react';

export default class DetailCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    supprimer: PropTypes.func.isRequired,
  }

  render() {
    const { offres, contenus, supprimer } = this.props;
    return (
      <ul>
      {contenus.map((contenu, idx) => (
        <li key={idx}>
          {offres[contenu.offreId].prix} x {contenu.quantite}
          <button onClick={() => supprimer(contenu.offreId)}>x</button>
        </li>))
      }
      </ul>
    );
  }
}
