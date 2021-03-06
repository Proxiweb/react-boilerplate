import React, { Component } from 'react';
import PropTypes from 'prop-types';
import round from 'lodash/round';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
  TableFooter,
} from 'material-ui/Table';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import buildCommandeRow from 'components/DetailCommandeColumns';
import styles from './styles.css';
const headerColStyle = { color: 'black', fontSize: '14px' };
import shader from 'shader';
const headers = [
  {
    label: 'Désignation',
    className: 'bigCol',
  },
  {
    label: 'Prix',
    className: 'smallCol',
  },
  {
    label: 'Qté',
    className: 'smallCol',
    tooltip: 'Quantité',
  },
  {
    label: 'Total',
    className: 'smallCol',
    tooltip: 'Total articles',
  },
];
export default class DetailCommande extends Component {
  // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commandeId: PropTypes.string,
    utilisateurId: PropTypes.string.isRequired,
    produits: PropTypes.object.isRequired,
    diminuer: PropTypes.func,
    augmenter: PropTypes.func,
    readOnly: PropTypes.bool,
    panierExpanded: PropTypes.bool.isRequired,
    filter: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    readOnly: false,
    panierExpanded: false,
  };

  render() {
    const {
      offres,
      produits,
      // contenus,
      diminuer,
      readOnly,
      augmenter,
      commandeId,
      commandeContenus,
      panierExpanded,
      utilisateurId,
      filter,
    } = this.props;

    const { muiTheme } = this.context;

    const totaux = calculeTotauxCommande({
      filter,
      offres,
      commandeContenus,
      commandeId,
    });

    const contenus = Object.keys(commandeContenus)
      .filter(
        id => (!filter || filter(commandeContenus[id])) && commandeContenus[id].commandeId === commandeId
      )
      .map(id => commandeContenus[id]);

    return (
      <div>
        <Table
          selectable={false}
          multiSelectable={false}
          className={panierExpanded ? styles.borderedFull : styles.bordered}
          height={contenus.length > 4 ? 200 : null}
          fixedFooter
        >
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow
              style={{
                backgroundColor: muiTheme.palette.tableHeaderBackgroundColor,
              }}
            >
              {headers.map((h, idx) =>
                <TableHeaderColumn
                  tooltip={h.tooltip || h.label}
                  className={styles[h.className]}
                  style={headerColStyle}
                  key={idx}
                >
                  {h.label}
                </TableHeaderColumn>
              )}
              {!readOnly &&
                <TableHeaderColumn
                  tooltip="Supprimer"
                  className={styles.lessSmallCol}
                  style={headerColStyle}
                />}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {contenus.map((contenu, idx) => {
              if (!contenu) return null;
              const offre = offres[contenu.offreId];

              const commandeCommandeContenus = Object.keys(commandeContenus)
                .filter(
                  key =>
                    commandeContenus[key].commandeId === commandeId &&
                    commandeContenus[key].offreId === offre.id
                )
                .map(key => commandeContenus[key]);

              const qteTotalOffre = commandeCommandeContenus
                .filter(cC => cC.utilisateurId !== contenu.utilisateurId)
                .reduce((memo, item) => memo + item.quantite + item.qteRegul, 0);

              const tarif = trouveTarification(offre.tarifications, qteTotalOffre, contenu.quantite);

              const tarifEnBaisse = offre.tarifications[0].prix > tarif.prix;

              const rows = buildCommandeRow({
                contenu,
                idx,
                offre,
                tarifEnBaisse,
                colorTrendingDown: shader(muiTheme.palette.tableHeaderBackgroundColor, -0.4),
                tarif,
                produit: produits[offre.produitId],
              });
              return (
                <TableRow key={idx} selectable={false} displayBorder>
                  {rows}
                  {!readOnly &&
                    <TableRowColumn className={styles.lessSmallCol}>
                      {contenu.offreId !== '8b330a52-a605-4a67-aee7-3cb3c9274733' &&
                        <button
                          onClick={() =>
                            augmenter({
                              commandeId,
                              offreId: contenu.offreId,
                              utilisateurId,
                              quantite: 1,
                            })}
                          title="quantite + 1"
                        >
                          +
                        </button>}
                      {contenu.offreId !== '8b330a52-a605-4a67-aee7-3cb3c9274733' &&
                        <button
                          onClick={() =>
                            diminuer({
                              commandeId,
                              offreId: contenu.offreId,
                              utilisateurId,
                            })}
                          title="quantite - 1"
                        >
                          -
                        </button>}
                    </TableRowColumn>}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter />
        </Table>
        {!panierExpanded &&
          <div
            style={{
              textAlign: 'center',
              padding: '1rem 0',
              backgroundColor: 'white',
              border: 'solid 1px gray',
            }}
          >
            Total :
            {' '}
            <strong>
              {round(totaux.prix + totaux.recolteFond, 2).toFixed(2)} €
            </strong>
            {' '}
            {totaux.prixBase !== totaux.prix
              ? <span style={{ color: 'red' }}>
                  <s>
                    {round(totaux.prixBase + totaux.recolteFondBase, 2).toFixed(2)}
                    {' '}
                    €
                  </s>
                  {' '}
                </span>
              : ''}
            ( dont
            {' '}
            <strong>{round(totaux.recolteFond, 2).toFixed(2)}</strong>
            {' '}
            € pour la prestation de distribution )
          </div>}
      </div>
    );
  }
}
