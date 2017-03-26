import React from 'react';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
  TableFooter,
} from 'material-ui/Table';

const FinalisationDetails = ({ destinataires }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>Nom</TableHeaderColumn>
        <TableHeaderColumn>Montant</TableHeaderColumn>
        <TableHeaderColumn>Paiement Effectué</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {destinataires.map(dest => {
        return (
          <TableRow>
            <TableRowColumn>{dest.nom}</TableRowColumn>
            <TableRowColumn>{dest.montant} €</TableRowColumn>
            <TableRowColumn>{dest.paiementOk ? 'oui' : 'non'}</TableRowColumn>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

FinalisationDetails.propTypes = {
  destinataires: React.PropTypes.array.isRequired,
};

export default FinalisationDetails;
