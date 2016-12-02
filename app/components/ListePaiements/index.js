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

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    require('moment/locale/fr'); // eslint-disable-line
    moment.locale('fr');
  }

  render() {
    const { paiements } = this.props;
    const { palette } = this.context.muiTheme;
    const headeStyle = {
      textAlign: 'center',
      backgroundColor: palette.tableHeaderBackgroundColor,
      color: 'black',
      fontSize: '16px',
    };
    return (
      <Table
        selectable={false}
        multiSelectable={false}
        className={styles.bordered}
        height={window.innerHeight - 190}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Opération" width="55" style={headeStyle}>Opération</TableHeaderColumn>
            <TableHeaderColumn tooltip="Objet" width="240" style={headeStyle}>Objet</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date" style={headeStyle}>Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {paiements.map((paiement, idx) => {
            const { type, montant, memo } = paiement;
            return (
              <TableRow
                key={idx}
                selectable={false}
                displayBorder
                style={{
                  borderBottom: 'solid 1px silver',
                  backgroundColor: idx % 2 === 0 ? 'white' : palette.oddColor,
                }}
              >
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
