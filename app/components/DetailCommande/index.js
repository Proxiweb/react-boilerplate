import React, { Component, PropTypes } from 'react';
import round from 'lodash/round';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
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
export default class DetailCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commandeId: PropTypes.string,
    produits: PropTypes.object.isRequired,
    diminuer: PropTypes.func,
    augmenter: PropTypes.func,
    readOnly: PropTypes.bool,
    panierExpanded: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    readOnly: false,
    panierExpanded: false,
  }

  render() {
    const {
      offres,
      produits,
      contenus,
      diminuer,
      readOnly,
      augmenter,
      commandeId,
      commandeContenus,
      panierExpanded,
    } = this.props;

    const { muiTheme } = this.context;

    const totaux = calculeTotauxCommande({ contenus, offres, commandeContenus, commandeId });

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
            <TableRow style={{ backgroundColor: muiTheme.palette.tableHeaderBackgroundColor }}>
              {headers.map((h, idx) => (
                <TableHeaderColumn
                  tooltip={h.tooltip || h.label}
                  className={styles[h.className]}
                  style={headerColStyle}
                  key={idx}
                >
                  {h.label}
                </TableHeaderColumn>)
              )}
              {!readOnly && <TableHeaderColumn tooltip="Supprimer" className={styles.lessSmallCol} style={headerColStyle} />}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {contenus.map((contenu, idx) => {
              if (!contenu) return null;
              const offre = offres[contenu.offreId];


              const commandeCommandeContenus =
                Object.keys(commandeContenus).filter((key) =>
                  commandeContenus[key].commandeId === commandeId &&
                  commandeContenus[key].offreId === offre.id
                ).map((key) => commandeContenus[key]);

              const qteTotalOffre = commandeCommandeContenus
                                      .filter((cC) => cC.utilisateurId !== contenu.utilisateurId)
                                      .reduce((memo, item) => memo + item.quantite + item.qteRegul, 0);

              const tarif = trouveTarification(
                offre.tarifications,
                qteTotalOffre,
                contenu.quantite
              );

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
                  { rows }
                  {!readOnly && (<TableRowColumn className={styles.lessSmallCol}>
                    <button onClick={() => augmenter(commandeId, contenu.offreId)} title="quantite + 1">+</button>
                    <button onClick={() => diminuer(commandeId, contenu.offreId)} title="quantite - 1">-</button>
                  </TableRowColumn>)}
                </TableRow>
              ); })
            }
          </TableBody>
        </Table>
        {!panierExpanded && (
          <div style={{ textAlign: 'center', padding: '1rem 0', backgroundColor: 'white', border: 'solid 1px gray' }}>
            Total : <strong>{round(totaux.prix + totaux.recolteFond, 2).toFixed(2)} €</strong>{' '}
            {totaux.prixBase !== totaux.prix ? <span style={{ color: 'red' }}><s>{round(totaux.prixBase + totaux.recolteFondBase, 2).toFixed(2)} €</s> </span> : ''}
            ( dont <strong>{round(totaux.recolteFond, 2).toFixed(2)}</strong> € pour la prestation de distribution )
          </div>
        )}
      </div>
    );
  }
}
