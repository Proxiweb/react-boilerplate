import React, { Component, PropTypes } from 'react';
import round from 'lodash.round';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import TrendingDownIcon from 'material-ui/svg-icons/action/trending-down';
import IconButton from 'material-ui/IconButton';
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
    produits: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    diminuer: PropTypes.func.isRequired,
    augmenter: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    montant: PropTypes.string.isRequired,
    recolteFond: PropTypes.string.isRequired,
    commandeId: PropTypes.string,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    readOnly: false,
  }

  render() {
    const {
      offres,
      produits,
      contenus,
      diminuer,
      readOnly,
      montant,
      recolteFond,
      augmenter,
      commandeId,
      commandeContenus,
    } = this.props;

    const { muiTheme } = this.context;

    const totaux = contenus.reduce((memo, contenu) => {
      const offre = offres[contenu.offreId];

      const commandeCommandeContenus =
        Object.keys(commandeContenus).filter((key) =>
          commandeContenus[key].commandeId === commandeId &&
          commandeContenus[key].offreId === offre.id
        ).map((key) => commandeContenus[key]);

      const qteTotalOffre = commandeCommandeContenus
                              .reduce((mem, item) => mem + item.quantite, 0);

      const tarif = trouveTarification(offre.tarifications, qteTotalOffre, contenu.quantite);
      const qte = contenu.quantite + (contenu.qteRegul || 0);
      return {
        prixBase: memo.prixBase + round((offre.tarifications[0].prix * qte) / 100, 2),
        recolteFondBase: memo.recolteFondBase + round((offre.tarifications[0].recolteFond * qte) / 100, 2),
        prix: memo.prix + round((tarif.prix * qte) / 100, 2),
        recolteFond: memo.recolteFond + round((tarif.recolteFond * qte) / 100, 2),
      };
    }, { prix: 0, recolteFond: 0, prixBase: 0, recolteFondBase: 0 });

    return (
      <div>
        <Table
          selectable={false}
          multiSelectable={false}
          className={styles.bordered}
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
                                      .reduce((memo, item) => memo + item.quantite, 0);

              const tarif = trouveTarification(offre.tarifications, qteTotalOffre, contenu.quantite);
              const tarifEnbaisse = offre.tarifications[0].prix > tarif.prix;
              return (
                <TableRow key={idx} selectable={false} displayBorder>
                  <TableRowColumn
                    className={styles.bigCol}
                    tooltip="test"
                  >
                    <span>
                      {produits[offre.produitId].nom}{` ${offre.description || ''}`}
                      {offre.poids && ` ${parseInt(offre.poids, 10) / 1000}g`}
                    </span>
                    {tarifEnbaisse &&
                      <TrendingDownIcon
                        style={{ verticalAlign: 'middle', color: shader(muiTheme.palette.tableHeaderBackgroundColor, -0.4) }}
                        tooltip="Tarif en baisse"
                      />}
                  </TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>
                    {(parseInt((tarif.prix + tarif.recolteFond), 10) / 100).toFixed(2)}
                    {tarifEnbaisse &&
                      <span style={{ color: 'red' }}>
                        {' '}<s>{(parseInt((offre.tarifications[0].prix + offre.tarifications[0].recolteFond), 10) / 100).toFixed(2)}</s>
                      </span>
                    }
                  </TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>{contenu.quantite}</TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>
                    {round(((tarif.prix + tarif.recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}
                    {tarifEnbaisse &&
                      <span style={{ color: 'red' }}>
                        {' '}<s>{round(((offre.tarifications[0].prix + offre.tarifications[0].recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}</s>
                      </span>
                    }
                  </TableRowColumn>
                  {!readOnly && (<TableRowColumn className={styles.lessSmallCol}>
                    <button onClick={() => augmenter(commandeId, contenu.offreId)} title="quantite + 1">+</button>
                    <button onClick={() => diminuer(commandeId, contenu.offreId)} title="quantite - 1">-</button>
                  </TableRowColumn>)}
                </TableRow>
              ); })
            }
          </TableBody>
        </Table>
        <div style={{ textAlign: 'center', padding: '2rem 0', backgroundColor: 'white', border: 'solid 1px gray' }}>
          Total : <strong>{round(totaux.prix + totaux.recolteFond, 2)} €</strong>{' '}
          {totaux.prixBase !== totaux.prix ? <span style={{ color: 'red' }}><s>{round(totaux.prixBase + totaux.recolteFondBase, 2)} €</s> </span> : ''}
          ( dont <strong>{round(totaux.recolteFond, 2)}</strong> € pour la prestation de distribution )
        </div>
      </div>
    );
  }
}
