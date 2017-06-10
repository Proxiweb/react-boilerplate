import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import DetailCommandeDistributeurProduit from './DetailCommandeDistributeurProduit';
import includes from 'lodash/includes';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

// eslint-disable-next-line
export default class DetailCommandeDistributeur extends Component {
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
    const { produits, contenus, commandeContenus, selectable, commandeId, roles } = this.props;
    const grouped = groupBy(contenus, 'offreId');
    const contenusAgg = Object.keys(grouped).map(offreId =>
      grouped[offreId].reduce(
        (m, c) => ({ offreId, quantite: m.quantite + c.quantite, qteRegul: m.qteRegul + c.qteRegul }),
        { offreId, quantite: 0, qteRegul: 0 }
      )
    );

    const { muiTheme } = this.context;
    const isAdmin = includes(roles, 'ADMIN');
    return (
      <Table selectable={selectable} multiSelectable={selectable} onCellHover={this.handleRowSelection}>
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
              Part distrib.
            </TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>
              Quantité
            </TableHeaderColumn>
            <TableHeaderColumn style={{ color: 'black' }}>
              Total
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={selectable}>
          {commandeContenus &&
            contenusAgg
              // .filter(pdt => contenus.find(c => c.offre.produitId === pdt.id))
              .map((contenu, key) => {
                const contenuComplet = contenus.find(c => c.offreId === contenu.offreId);
                const produit = produits.find(pdt => pdt.id === contenuComplet.offre.produitId);
                if (!produit) return null;
                return (
                  <DetailCommandeDistributeurProduit
                    idx={key}
                    produit={produit}
                    selectable={selectable}
                    contenu={contenus
                      .filter(c => c.offreId === contenu.offreId)
                      .reduce((m, c) => ({ ...c, quantite: c.qteRegul + c.quantite + m.quantite }), {
                        quantite: 0,
                      })}
                    qteTotalOffre={commandeContenus
                      .filter(c => c.offreId === contenu.offreId)
                      .reduce((memo, item) => memo + item.quantite + item.qteRegul, 0)}
                    offre={contenuComplet.offre}
                    commandeId={commandeId}
                    readOnly={!isAdmin}
                  />
                );
              })}
        </TableBody>
      </Table>
    );
  }
}
