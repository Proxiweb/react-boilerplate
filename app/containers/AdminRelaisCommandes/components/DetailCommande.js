import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import DetailCommandeProduit from './DetailCommandeProduit';
import includes from 'lodash/includes';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

// eslint-disable-next-line
export default class DetailsCommande extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    contenusFiltered: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    selectable: PropTypes.bool.isRequired,
    souligneQte: PropTypes.bool.isRequired,
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
      contenusFiltered,
      commandeContenus,
      selectable,
      commandeId,
      offres,
      roles,
      souligneQte,
    } = this.props;

    const grouped = groupBy(contenusFiltered, 'offreId');
    const contenusAgg = Object.keys(grouped).map(offreId =>
      grouped[offreId].reduce(
        (m, c) => ({
          offreId,
          quantite: m.quantite + c.quantite,
          qteRegul: m.qteRegul + c.qteRegul,
        }),
        { offreId, quantite: 0, qteRegul: 0 }
      )
    );

    const { muiTheme } = this.context;
    const isAdmin = includes(roles, 'RELAI_ADMIN') || includes(roles, 'ADMIN');

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
            contenusAgg
              // .filter(pdt => contenusFiltered.find(c => c.offre.produitId === pdt.id))
              .map((contenu, key) => {
                const contenuComplet = contenusFiltered.find(c => c.offreId === contenu.offreId);
                const produit = produits.find(pdt => pdt.id === offres[contenuComplet.offreId].produitId);
                if (!produit) return null;
                return (
                  <DetailCommandeProduit
                    idx={key}
                    produit={produit}
                    selectable={selectable}
                    contenu={contenusFiltered.filter(c => c.offreId === contenu.offreId).reduce((m, c) => ({
                      ...c,
                      quantite: c.qteRegul + c.quantite + m.quantite,
                    }), {
                      quantite: 0,
                    })}
                    qteTotalOffre={commandeContenus
                      .filter(c => c.offreId === contenu.offreId)
                      .reduce((memo, item) => memo + item.quantite + item.qteRegul, 0)}
                    offre={offres[contenuComplet.offreId]}
                    commandeId={commandeId}
                    readOnly={!isAdmin}
                    souligneQte={souligneQte}
                  />
                );
              })}
        </TableBody>
      </Table>
    );
  }
}
