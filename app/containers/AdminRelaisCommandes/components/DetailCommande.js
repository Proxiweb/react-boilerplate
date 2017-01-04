import React, { PropTypes, Component } from 'react';
import DetailCommandeProduit from './DetailCommandeProduit';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class DetailsCommande extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    selectable: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    selectable: false,
  }

  handleRowSelection = (selectedRows) =>
    console.log(selectedRows);

  render() {
    const { produits, contenus, commandeContenus, selectable } = this.props;
    const { muiTheme } = this.context;
    return (
      <Table selectable={selectable} multiSelectable={selectable} onCellHover={this.handleRowSelection}>
        <TableHeader displaySelectAll={selectable} style={{ backgroundColor: muiTheme.palette.tableHeaderBackgroundColor }}>
          <TableRow>
            <TableHeaderColumn style={{ color: 'black' }}>Désignation</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Prix</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Quantité</TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>Total</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={selectable}>
          {commandeContenus &&
            produits
              .filter((pdt) => contenus.find((c) => c.offre.produitId === pdt.id))
              .map((pdt, key) => (
                <DetailCommandeProduit
                  idx={key}
                  produit={pdt}
                  selectable={selectable}
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
