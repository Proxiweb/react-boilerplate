import React from 'react';
import round from 'lodash.round';  // eslint-disable-line id-length
import styles from './styles.css';

const convertisseurs = {
  mg: (poids) => {
    const unite = poids / 1000000 < 1 ? 'g' : ' Kg';
    const poidsFormat = unite === 'g' ? poids / 1000 : poids / 1000000;
    return `${round(poidsFormat, 2)}${unite}`;
  },
  ml: (poids) => {
    let unite;
    let poidsFormat;
    if (poids < 100) {
      unite = 'ml';
      poidsFormat = poids;
    } else if (poids > 100 && poids < 1000) {
      unite = 'cl';
      poidsFormat = poids / 10;
    } else {
      unite = 'L';
      poidsFormat = poids / 1000;
    }
    return `${round(poidsFormat, 2)}${unite}`;
  },
};

export const formatterPoids = (offre) => {
  if (!offre.poids) return '';
  const qteUnit = offre.produit && offre.produit.typeProduit ? offre.produit.typeProduit.quantiteUnite : 'mg';
  const convertisseur = convertisseurs[qteUnit];

  return convertisseur(offre.poids);
};

function detailPrix(offre) {
  return (
    <span>
      <span>{`${formatterPoids(offre)}${offre.description ? ` ${offre.description} ` : ''}`}</span> :
      <span> <strong>{round((offre.prix + offre.recolteFond) / 100, 2)} €</strong></span>
    </span>
  );
}

function prixAuKg(offre, typeProduit) {
  if (!offre.poids) return '';
  if (typeProduit.quantiteUnite === 'ml') return '';
  return (
    <span className={styles.prixAuKg}>
      {`${round(((offre.prix + offre.recolteFond) * 10000) / offre.poids, 2)} €/Kg`}
    </span>
  );
}

const OffreDetail = (props) => {
  const { offre, deuxLignes, typeProduit } = props;

  if (!deuxLignes) {
    return (
      <div className={`row ${styles.offreUneLigne}`}>
        <div className={`col-md ${styles.offreDesignation}`}>{detailPrix(offre)}</div>
        <div className={`col-md ${styles.offrePrix}`}>
          <div>{offre.poids && prixAuKg(offre, typeProduit)}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>{detailPrix(offre)}</div>
      {offre.poids && typeProduit.quantiteUnite !== 'u' && prixAuKg(offre, typeProduit)}
    </div>
  );
};

OffreDetail.propTypes = {
  offre: React.PropTypes.object.isRequired,
  typeProduit: React.PropTypes.object.isRequired,
  deuxLignes: React.PropTypes.bool,
};

export default OffreDetail;
