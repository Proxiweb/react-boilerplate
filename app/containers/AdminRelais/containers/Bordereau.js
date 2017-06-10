import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import round from "lodash/round";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
  TableFooter
} from "material-ui/Table";

export default class DepotsRelais extends Component {
  // eslint-disable-line
  static propTypes = {
    depots: PropTypes.array.isRequired
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  render() {
    const { depots } = this.props;
    const { muiTheme } = this.context;
    const total = depots.reduce((memo, depot) => memo + depot.montant, 0);
    const align = { textAlign: "right" };
    return (
      <Table height={depots.length > 4 ? 200 : null}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          height={100}
          style={{ backgroundColor: muiTheme.palette.tableHeaderBackgroundColor }}
        >
          <TableRow style={{ color: "black" }}>
            <TableHeaderColumn>Utilisateur</TableHeaderColumn>
            <TableHeaderColumn>Code Commande</TableHeaderColumn>
            <TableHeaderColumn style={align}>Montant</TableHeaderColumn>
            <TableHeaderColumn style={align}>Fait</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {depots.map((depot, idx) =>
            <TableRow key={idx} selectable={false}>
              <TableRowColumn>
                {capitalize(depot.utilisateur.prenom)} <strong>{depot.utilisateur.nom.toUpperCase()}</strong>
              </TableRowColumn>
              <TableRowColumn style={align}>
                {depot.infosSupplement.commandeId ? depot.infosSupplement.commandeId : "aucun"}
              </TableRowColumn>
              <TableRowColumn style={align}>{parseFloat(depot.montant).toFixed(2)}</TableRowColumn>
              <TableRowColumn style={align}>{depot.fait ? "oui" : "non"}</TableRowColumn>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn />
            <TableRowColumn />
            <TableRowColumn style={align}>Total <strong>{round(total, 2)} €</strong></TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}
