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
  TableFooter,
} from 'material-ui/Table';

import { saveCommande } from 'containers/Commande/actions';
import { selectCommande } from 'containers/Commande/selectors';

class FinalisationDetails extends Component {
  static propTypes = {
    commande: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    destinataires: PropTypes.array.isRequired,
    saveCommande: PropTypes.func.isRequired,
  };

  state = {
    selectedIdx: null,
  };

  handleSelection = ([selectedIdx]) => {
    const { destinataires } = this.props;
    this.setState({
      selectedIdx: typeof selectedIdx !== 'undefined' ? selectedIdx : null,
    });
  };

  handleClick = value => {
    const { destinataires, commande } = this.props;
    const { selectedIdx } = this.state;
    const newDest = destinataires.map(
      (d, idx) =>
        idx === selectedIdx ? { ...d, paiementOk: !d.paiementOk } : { ...d }
    );
    this.props.saveCommande(
      {
        ...commande,
        finalisation: { ...commande.finalisation, destinataires: newDest },
      },
      value ? 'Paiement commande sauvegardé' : 'Paiement commande annulé'
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
              (<TableRow selected={idx === selectedIdx}>
                <TableRowColumn>{dest.nom}</TableRowColumn>
                <TableRowColumn>{dest.montant} €</TableRowColumn>
                <TableRowColumn>
                  {dest.paiementOk ? 'oui' : 'non'}
                </TableRowColumn>
              </TableRow>)
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
              onClick={() =>
                this.handleClick(!destinataires[selectedIdx].paiementOk)}
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
