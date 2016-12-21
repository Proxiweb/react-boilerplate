import React from 'react';
import round from 'lodash/round';
import memoize from 'lodash/memoize';
import styles from './AffichePrix.css';

const trouveTarificationFn = (tarifications, totalGlobal = 0, totalCommande = 0) => {
  const total = totalGlobal + totalCommande;
  return tarifications
          .sort((a, b) => a.qteMinRelais > b.qteMinRelais)
          .find((tar, idx, arr) =>
            total >= tar.qteMinRelais &&
            (!arr[idx + 1] || arr[idx + 1].qteMinRelais >= (total + 1))
          );
};

export const trouveTarification = memoize(trouveTarificationFn);

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

function detailPrix(offre, qteCommande) {
  const tarif = trouveTarification(offre.tarifications, offre.quantiteTotal, qteCommande);
  let ancien = null;
  if (tarif.qteMinRelais !== offre.tarifications[0].qteMinRelais) {
    const t = offre.tarifications[0];
    ancien = <span style={{ color: 'red' }}><s>{round((t.prix + t.recolteFond) / 100, 2)} €</s>{' '}</span>;
  }
  return (
    <span>
      <span>{`${formatterPoids(offre)}${offre.description ? ` ${offre.description} ` : ' '}`}</span> :
      <span><strong>{round((tarif.prix + tarif.recolteFond) / 100, 2)} €</strong> {ancien}</span>
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
  const { offre, deuxLignes, typeProduit, qteCommande } = props;

  if (!deuxLignes) {
    return (
      <div className={`row ${styles.offreUneLigne}`}>
        <div className={`col-md ${styles.offreDesignation}`}>{detailPrix(offre, qteCommande)}</div>
        <div className={`col-md ${styles.offrePrix}`}>
          <div>{offre.poids && prixAuKg(offre, typeProduit)}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>{detailPrix(offre, qteCommande)}</div>
      {offre.poids && typeProduit.quantiteUnite !== 'u' && prixAuKg(offre, typeProduit)}
    </div>
  );
};

OffreDetail.propTypes = {
  offre: React.PropTypes.object.isRequired,
  qteCommande: React.PropTypes.number.isRequired,
  typeProduit: React.PropTypes.object.isRequired,
  deuxLignes: React.PropTypes.bool,
};

export default OffreDetail;
