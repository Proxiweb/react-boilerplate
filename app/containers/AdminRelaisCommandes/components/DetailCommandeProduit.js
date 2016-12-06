import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import round from 'lodash.round';


export default class CommnandeParProduitFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
    offre: PropTypes.object.isRequired,
  }

  render() {
    const { produit, contenus, offre } = this.props;
    const quantite = contenus.reduce((memo, c) => memo + c.quantite, 0);
    return (
      <TableRow>
        <TableRowColumn>{produit.nom}</TableRowColumn>
        <TableRowColumn>{quantite}</TableRowColumn>
        <TableRowColumn>{round(parseInt(offre.prix, 10) / 100, 2).toFixed(2)}</TableRowColumn>
        <TableRowColumn>{round(parseInt(offre.recolteFond, 10) / 100, 2).toFixed(2)}</TableRowColumn>
        <TableRowColumn>{round(((offre.recolteFond + parseInt(offre.prix, 10)) * quantite) / 100, 2).toFixed(2)}</TableRowColumn>
      </TableRow>
    );
  }
}
