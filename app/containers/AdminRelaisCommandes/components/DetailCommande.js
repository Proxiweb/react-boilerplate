import React, { PropTypes, Component } from 'react';
import DetailCommandeProduit from './DetailCommandeProduit';
import includes from 'lodash/includes';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';

// eslint-disable-next-line
export default class DetailsCommande extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired,
    commandeId: PropTypes.string.isRequired,
    contenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    selectable: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    selectable: false,
  };

  handleRowSelection = selectedRows => console.log(selectedRows); // eslint-disable-line

  render() {
    const {
      produits,
      contenus,
      commandeContenus,
      selectable,
      commandeId,
      roles,
    } = this.props;

    const { muiTheme } = this.context;
    const isAdmin = includes(roles, 'ADMIN');
    return (
      <Table
        selectable={selectable}
        multiSelectable={selectable}
        onCellHover={this.handleRowSelection}
      >
        <TableHeader
          displaySelectAll={selectable}
          style={{
            backgroundColor: muiTheme.palette.tableHeaderBackgroundColor,
          }}
        >
          <TableRow>
            <TableHeaderColumn style={{ color: 'black' }}>
              Désignation
            </TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>
              Prix
            </TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>
              Quantité
            </TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>
              Total
            </TableHeaderColumn>
            {isAdmin &&
              <TableHeaderColumn style={{ color: 'black' }}>
                Modif
              </TableHeaderColumn>}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={selectable}>
          {commandeContenus &&
            produits
              .filter(pdt => contenus.find(c => c.offre.produitId === pdt.id))
              .map((pdt, key) => (
                <DetailCommandeProduit
                  idx={key}
                  produit={pdt}
                  selectable={selectable}
                  contenus={contenus.filter(c => c.offre.produitId === pdt.id)}
                  qteTotalOffre={commandeContenus
                    .filter(c => c.offre.produitId === pdt.id)
                    .reduce(
                      (memo, item) => memo + item.quantite + item.qteRegul,
                      0,
                    )}
                  offre={contenus.find(c => c.offre.produitId === pdt.id).offre}
                  commandeId={commandeId}
                  readOnly={!isAdmin}
                />
              ))}
        </TableBody>
      </Table>
    );
  }
}
