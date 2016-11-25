import React, { Component, PropTypes } from 'react';
import round from 'lodash.round';
import FlatButton from 'material-ui/FlatButton';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn, TableFooter } from 'material-ui/Table';
import styles from './styles.css';
export default class DetailCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    supprimer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    montant: PropTypes.string.isRequired,
    recolteFond: PropTypes.string.isRequired,
  }

  static defaultProps = {
    readOnly: false,
  }

  render() {
    const { offres, produits, contenus, supprimer, readOnly, montant, recolteFond } = this.props;
    return (
      <div>
        <Table
          selectable={false}
          multiSelectable={false}
          className={styles.borderedo}
          height={contenus.length > 4 ? 200 : null}
          fixedFooter
        >
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip="Désignation" className={styles.bigCol}>Désignation</TableHeaderColumn>
              <TableHeaderColumn tooltip="Prix unitaire" className={styles.smallCol}>Prix</TableHeaderColumn>
              <TableHeaderColumn tooltip="Quantité" className={styles.smallCol}>Qté</TableHeaderColumn>
              <TableHeaderColumn tooltip="Total article" className={styles.smallCol}>Total</TableHeaderColumn>
              {!readOnly && <TableHeaderColumn tooltip="Supprimer" className={styles.smallCol}></TableHeaderColumn>}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {contenus.map((contenu, idx) => {
              if (!contenu) return;
              const offre = offres[contenu.offreId];
              return (
                <TableRow key={idx} selectable={false} displayBorder>
                  <TableRowColumn className={styles.bigCol}>
                    {produits[offre.produitId].nom}{` ${offre.description || ''}`}
                    {offre.poids && ` ${parseInt(offre.poids, 10) / 1000}g`}
                  </TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>
                    {(parseInt((offre.prix + offre.recolteFond), 10) / 100).toFixed(2)}
                  </TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>{contenu.quantite}</TableRowColumn>
                  <TableRowColumn className={styles.smallCol}>{round(((offre.prix + offre.recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}</TableRowColumn>
                  {!readOnly && (<TableRowColumn className={styles.smallCol}>
                    <FlatButton onClick={() => supprimer(contenu.offreId)} icon={<RemoveIcon />} />
                  </TableRowColumn>)}
                </TableRow>
              ); })
            }
          </TableBody>
        </Table>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Total : <strong>{montant} €</strong> ( dont <strong>{recolteFond}</strong> € pour la prestation de distribution )</div>
      </div>
    );
  }
}
