import React from 'react';
import { TableRowColumn } from 'material-ui/Table';
import TrendingDownIcon from 'material-ui/svg-icons/action/trending-down';
import round from 'lodash/round';
import styles from './styles.css';

const buildCommandeRow =
  ({ contenu, tarifEnBaisse, produit, offre, colorTrendingDown, tarif, idx }) =>
    [
      <TableRowColumn
        className={styles.bigCol}
        key={`${idx}1`}
      >
        <span>
          {produit.nom.toUpperCase()}{` ${offre.description || ''}`}
          {offre.poids && ` ${parseInt(offre.poids, 10) / 1000}g`}
        </span>
        {tarifEnBaisse &&
          <TrendingDownIcon
            style={{ verticalAlign: 'middle', color: colorTrendingDown }}
            tooltip="Tarif en baisse"
          />}
      </TableRowColumn>,
      <TableRowColumn className={styles.smallCol} key={`${idx}2`}>
        {(parseInt((tarif.prix + tarif.recolteFond), 10) / 100).toFixed(2)}
        {tarifEnBaisse &&
          <span style={{ color: 'red' }}>
            {' '}<s>{(parseInt((offre.tarifications[0].prix + offre.tarifications[0].recolteFond), 10) / 100).toFixed(2)}</s>
          </span>
        }
      </TableRowColumn>,
      <TableRowColumn className={styles.smallCol} key={`${idx}3`}>{contenu.quantite}</TableRowColumn>,
      <TableRowColumn className={styles.smallCol} key={`${idx}4`}>
        {round(((tarif.prix + tarif.recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}
        {tarifEnBaisse &&
          <span style={{ color: 'red' }}>
            {' '}<s>{round(((offre.tarifications[0].prix + offre.tarifications[0].recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}</s>
          </span>
        }
      </TableRowColumn>,
    ];

export default buildCommandeRow;
