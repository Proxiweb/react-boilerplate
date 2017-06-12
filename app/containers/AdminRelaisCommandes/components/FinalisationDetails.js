import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
} from 'material-ui/Table';

import { saveCommande } from 'containers/Commande/actions';
import { selectCommande } from 'containers/Commande/selectors';

class FinalisationDetails extends Component {
  static propTypes = {
    commande: PropTypes.object.isRequired,
    destinataires: PropTypes.array.isRequired,
    saveCommande: PropTypes.func.isRequired,
  };

  state = {
    selectedIdx: null,
  };

  handleSelection = ([selectedIdx]) =>
    this.setState({
      selectedIdx: typeof selectedIdx !== 'undefined' ? selectedIdx : null,
    });

  handleClick = () => {
    const { destinataires, commande } = this.props;
    const { selectedIdx } = this.state;
    this.props.saveCommande(
      {
        ...commande,
        finalisation: {
          ...commande.finalisation,
          destinataires: destinataires.map(
            (
              d,
              idx // eslint-disable-line
            ) =>
              (idx === selectedIdx
                ? { ...d, paiementOk: !d.paiementOk }
                : { ...d })
          ),
        },
      },
      'Opération effectuée'
    );
  };

  render() {
    const { destinataires } = this.props;
    const { selectedIdx } = this.state;
    return (
      <div>
        <Table onRowSelection={this.handleSelection}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Nom</TableHeaderColumn>
              <TableHeaderColumn>Montant</TableHeaderColumn>
              <TableHeaderColumn>Paiement Effectué</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false}>
            {destinataires.map((dest, idx) =>
              <TableRow selected={idx === selectedIdx}>
                <TableRowColumn>{dest.nom}</TableRowColumn>
                <TableRowColumn>{dest.montant} €</TableRowColumn>
                <TableRowColumn>
                  {dest.paiementOk ? 'oui' : 'non'}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedIdx !== null &&
          <div style={{ marginTop: '1em' }}>
            <RaisedButton
              label={
                destinataires[selectedIdx].paiementOk
                  ? 'Annuler le paiement'
                  : 'Valider le paiement'
              }
              primary
              fullWidth
              onTouchTap={this.handleClick}
            />
          </div>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commande: selectCommande(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveCommande,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  FinalisationDetails
);
