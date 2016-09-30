import React, { Component, PropTypes } from 'react';
import round from 'lodash.round';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import styles from './styles.css';
export default class DetailCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    supprimer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    readOnly: false,
  }

  render() {
    const { offres, produits, contenus, supprimer, readOnly } = this.props;
    const totalCommande = contenus.reduce((memo, contenu) => {
      const offre = offres[contenu.offreId];
      return memo + ((offre.prix + offre.recolteFond) * (contenu.quantite + (contenu.qteRegul || 0)));
    }, 0) / 100;
    return (
      <Table selectable={false} multiSelectable={false} className={styles.bordered}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Désignation" style={{ paddingLeft: 10, width: 290, paddingRight: 10 }}>Désignation</TableHeaderColumn>
            <TableHeaderColumn tooltip="Prix unitaire" style={{ width: 60, paddingLeft: 10, paddingRight: 10, textAlign: 'right' }}>Prix</TableHeaderColumn>
            <TableHeaderColumn tooltip="Quantité" style={{ width: 30, paddingLeft: 5, paddingRight: 5, textAlign: 'right' }}>Qté</TableHeaderColumn>
            <TableHeaderColumn tooltip="Total article" style={{ paddingLeft: 10, paddingRight: 80, textAlign: 'right' }}>Total</TableHeaderColumn>
            {!readOnly && <TableHeaderColumn tooltip="Supprimer" style={{ display: 'none' }}></TableHeaderColumn>}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
      {contenus.map((contenu, idx) => {
        const offre = offres[contenu.offreId];
        return (
          <TableRow key={idx} selectable={false}>
            <TableRowColumn style={{ width: 290, paddingLeft: 10, paddingRight: 10 }}>
              {produits[offre.produitId].nom}{` ${offre.description || ''}`}
            {offre.poids && ` ${parseInt(offre.poids, 10) / 1000}g`}
            </TableRowColumn>
            <TableRowColumn style={{ width: 60, textAlign: 'right', paddingLeft: 10, paddingRight: 10 }}>
              {(parseInt((offre.prix + offre.recolteFond), 10) / 100).toFixed(2)}
            </TableRowColumn>
            <TableRowColumn style={{ textAlign: 'right', width: 30, paddingLeft: 5, paddingRight: 5 }}>{contenu.quantite}</TableRowColumn>
            <TableRowColumn style={{ textAlign: 'right', paddingLeft: 10, paddingRight: 10 }}>{round(((offre.prix + offre.recolteFond) * contenu.quantite) / 100, 2).toFixed(2)}</TableRowColumn>
            {!readOnly && (<TableRowColumn style={{ width: 50 }}>
              <button onClick={() => supprimer(contenu.offreId)} style={{ cursor: 'pointer' }}>
                x
              </button>
            </TableRowColumn>)}
          </TableRow>
        ); })
      }
          <TableRow>
            <TableRowColumn colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</TableRowColumn>
            <TableRowColumn style={{ textAlign: 'right', paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>{totalCommande}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
