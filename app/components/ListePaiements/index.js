import React, { Component, PropTypes } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import moment from 'moment';
import styles from './styles.css';
export default class ListePaiements extends Component { // eslint-disable-line
  static propTypes = {
    paiements: PropTypes.array.isRequired,
  }

  static defaultProps = {
    readOnly: false,
  }

  constructor(props) {
    super(props);
    require('moment/locale/fr'); // eslint-disable-line
    moment.locale('fr');
  }

  render() {
    const { paiements } = this.props;
    return (
      <Table selectable={false} multiSelectable={false} className={styles.bordered}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Crédit">Crédit</TableHeaderColumn>
            <TableHeaderColumn tooltip="Débit">Débit</TableHeaderColumn>
            <TableHeaderColumn tooltip="Objet">Objet</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date">Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {paiements.map((paiement, idx) => {
            const { type, montant, memo } = paiement;
            return (
              <TableRow key={idx} selectable={false}>
                <TableRowColumn style={{ textAlign: 'right' }}>{type === 'credit' && montant}</TableRowColumn>
                <TableRowColumn style={{ textAlign: 'right' }}>{type === 'debit' && montant}</TableRowColumn>
                <TableRowColumn>{memo}</TableRowColumn>
                <TableRowColumn>{moment(paiement.date).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
