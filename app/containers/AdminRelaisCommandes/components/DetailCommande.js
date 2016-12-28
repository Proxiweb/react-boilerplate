import React, { PropTypes, Component } from 'react';
import DetailCommandeProduit from './DetailCommandeProduit';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

export default class DetailsCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { produits, contenus, commandeContenus } = this.props;
    const { muiTheme } = this.context;
    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} style={{ backgroundColor: muiTheme.palette.tableHeaderBackgroundColor }}>
          <TableRow>
            <TableHeaderColumn style={{ color: 'black' }}>Désignation</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Quantité</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Prix</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Recolte fond</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Total</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits
            .filter((pdt) => contenus.find((c) => c.offre.produitId === pdt.id))
            .map((pdt, key) => (
              <DetailCommandeProduit
                key={key}
                produit={pdt}
                contenus={contenus.filter((c) => c.offre.produitId === pdt.id)}
                qteTotalOffre={
                  commandeContenus
                    .filter((c) => c.offre.produitId === pdt.id)
                    .reduce((memo, item) => memo + item.quantite + item.qteRegul, 0)
                }
                offre={contenus.find((c) => c.offre.produitId === pdt.id).offre}
              />))
          }
        </TableBody>
      </Table>
    );
  }
}
