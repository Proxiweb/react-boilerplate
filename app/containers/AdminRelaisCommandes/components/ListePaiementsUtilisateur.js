import React, { Component, PropTypes } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
} from 'material-ui/Table';
import moment from 'moment';
import round from 'lodash/round';
import api from 'utils/stellarApi';

import styles from './styles.css';

const mergeEffectInfos = effect =>
  new Promise((resolve, reject) => {
    effect
      .operation()
      .then(operation => {
        operation
          .transaction()
          .then(transaction => {
            const { amount, type } = effect;
            const { memo, created_at, source_account_sequence } = transaction;
            resolve({
              amount,
              type,
              memo,
              created_at,
              source_account_sequence,
            });
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

export default class ListePaiements extends Component {
  // eslint-disable-line
  static propTypes = {
    stellarAddress: PropTypes.string.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    require('moment/locale/fr'); // eslint-disable-line
    moment.locale('fr');
    this.state = { effects: null };
  }

  componentDidMount = () => this.loadEffects();

  componentWillReceiveProps = () => {
    this.setState({ effects: null });
    this.loadEffects();
  };

  loadEffects = () => api.loadEffects(this.props.stellarAddress, 5).then(effects => {
    Promise.all(effects.map(effect => mergeEffectInfos(effect))).then(effectInfos =>
        this.setState({ effects: effectInfos }));
  });

  render() {
    if (!this.state.effects) return null;
    const { effects } = this.state;
    const { palette } = this.context.muiTheme;
    const headeStyle = {
      textAlign: 'center',
      backgroundColor: palette.tableHeaderBackgroundColor,
      color: 'black',
      fontSize: '16px',
    };
    return (
      <Table selectable={false} multiSelectable={false} className={styles.bordered}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Date" style={headeStyle}>Date</TableHeaderColumn>
            <TableHeaderColumn tooltip="Opération" width="55" style={headeStyle}>
              Opération
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="Objet" width="240" style={headeStyle}>
              Objet
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {effects.slice().sort((e1, e2) => e1 < e2).map((effect, idx) => {
            const { type, amount, memo } = effect;
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
                <TableRowColumn>
                  {moment(effect.created_at).format('DD/MM/YYYY HH:mm')}
                </TableRowColumn>
                <TableRowColumn width="45" style={{ textAlign: 'center' }}>
                  {
                    `${type === 'account_credited' ? '+' : '-'} ${round(parseFloat(amount), 2).toFixed(2)}`
                  }
                </TableRowColumn>
                <TableRowColumn width="240">{memo}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
