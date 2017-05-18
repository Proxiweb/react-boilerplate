import React from 'react';
import { TableRowColumn } from 'material-ui/Table';
import TrendingDownIcon from 'material-ui/svg-icons/action/trending-down';
import round from 'lodash/round';
import truncate from 'lodash/truncate';
import styles from './styles.css';

const buildNomProduit = (produit, offre) => {
  let np = produit.nom.toUpperCase();
  if (offre.description) {
    np += ` ${offre.description}`;
  }
  if (offre.poids) {
    np += ` ${parseInt(offre.poids, 10) / 1000}g`;
  }
  return np;
};

const buildCommandeRow = (
  {
    contenu,
    tarifEnBaisse,
    produit,
    offre,
    colorTrendingDown,
    tarif,
    idx,
    handleChangeQte,
    handleResetQuantite,
    souligneQte,
  }
) => [
  <TableRowColumn className={styles.bigCol} key={`${idx}1`}>
    <span>
      {truncate(buildNomProduit(produit, offre), { length: 35 })}
    </span>
    {tarifEnBaisse &&
      <TrendingDownIcon
        style={{ verticalAlign: 'middle', color: colorTrendingDown }}
        tooltip="Tarif en baisse"
      />}
  </TableRowColumn>,
  <TableRowColumn className={styles.smallCol} key={`${idx}2`}>
    {(parseInt(tarif.prix + tarif.recolteFond, 10) / 100).toFixed(2)}
    {tarifEnBaisse &&
      <span style={{ color: 'red' }}>
        {' '}
        <s>
          {(parseInt(offre.tarifications[0].prix + offre.tarifications[0].recolteFond, 10) / 100).toFixed(2)}
        </s>
      </span>}
  </TableRowColumn>,
  <TableRowColumn
    className={
      `${styles.smallCol} ${souligneQte && contenu.quantite > 1 && Number.isInteger(contenu.quantite) ? styles.souligneQte : ''}`
    }
    key={`${idx}3`}
  >
    {!handleChangeQte ? contenu.quantite : <button onClick={handleChangeQte}>{contenu.quantite}</button>}
    {handleResetQuantite &&
      <button title="Revenir à la quantité initiale" onClick={handleResetQuantite}>x</button>}
  </TableRowColumn>,
  <TableRowColumn className={styles.smallCol} key={`${idx}4`}>
    {round((tarif.prix + tarif.recolteFond) * (contenu.quantite + (contenu.qteRegul || 0)) / 100, 2).toFixed(
      2
    )}
    {tarifEnBaisse &&
      <span style={{ color: 'red' }}>
        {' '}
        <s>
          {round(
            (offre.tarifications[0].prix + offre.tarifications[0].recolteFond) * contenu.quantite / 100,
            2
          ).toFixed(2)}
        </s>
      </span>}
  </TableRowColumn>,
];

export default buildCommandeRow;
