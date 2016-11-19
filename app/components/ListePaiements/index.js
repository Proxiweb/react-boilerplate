import React, { Component, PropTypes } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn, TableFooter } from 'material-ui/Table';
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
      <Table selectable={false} multiSelectable={false} className={styles.bordered} height={350}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Opération" width="45" style={{ textAlign: 'center' }}>Opération</TableHeaderColumn>
            <TableHeaderColumn tooltip="Objet" width="240">Objet</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date">Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {paiements.map((paiement, idx) => {
            const { type, montant, memo } = paiement;
            return (
              <TableRow key={idx} selectable={false} displayBorder>
                <TableRowColumn width="45" style={{ textAlign: 'center' }}>{type === 'credit' ? `+${montant}` : `-${montant}`}</TableRowColumn>
                <TableRowColumn width="240">{memo}</TableRowColumn>
                <TableRowColumn>{moment(paiement.date).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
