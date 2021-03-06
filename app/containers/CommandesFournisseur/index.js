import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { format } from 'utils/dates';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import compareDesc from 'date-fns/compare_desc';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';

import { loadCommandes } from 'containers/Commande/actions';
import {
  makeSelectCommandeCommandeUtilisateurs,
  makeSelectCommandeCommandeContenus,
  makeSelectCommandeContenus,
  makeSelectFournisseurCommandes,
} from 'containers/Commande/selectors';

import {
  makeSelectLocationState,
  makeSelectPending,
} from 'containers/App/selectors';

import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CommandesFournisseur extends Component {
  static propTypes = {
    pending: PropTypes.bool.isRequired,
    load: PropTypes.func.isRequired,
    loadCde: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    locationState: PropTypes.object.isRequired,
    children: PropTypes.node,
    commandes: PropTypes.array,
    commandeUtilisateurs: PropTypes.array,
    commandeContenus: PropTypes.array,
    contenus: PropTypes.object,
  };

  componentDidMount() {
    const { params: { fournisseurId, commandeId }, load, loadCde } = this.props;

    load(fournisseurId);
    if (commandeId) {
      loadCde({ id: commandeId });
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.params.commandeId !== this.props.params.commandeId) {
      this.props.loadCde({ id: nextProps.params.commandeId });
    }
  };

  handleChangeList = (event, value) => {
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/commandes/${value}`
    );
  };

  render() {
    const {
      commandes,
      params: { commandeId, fournisseurId },
      commandeUtilisateurs,
      contenus,
      locationState,
      commandeContenus,
      pending,
    } = this.props;

    if (!commandes) return null;
    const print = locationState.locationBeforeTransitions.query.print;

    return (
      <div className="row">
        {!print &&
          <div className={classnames('col-md-3', styles.panel)}>
            <SelectableList value={commandeId} onChange={this.handleChangeList}>
              {commandes
                .slice()
                .filter(cde => cde.dateCommande)
                .sort((a, b) => compareDesc(a.dateCommande, b.dateCommande))
                .map((cde, idx) =>
                  (<ListItem
                    key={idx}
                    primaryText={format(cde.dateCommande, 'DD MM')}
                    value={cde.id}
                  />)
                )}
            </SelectableList>
          </div>}
        <div
          className={classnames(print ? 'col-md-12' : 'col-md-9', styles.panel)}
        >
          {!print &&
            commandeId &&
            <div className="row around-md">
              <div className="col-md-3">
                <RaisedButton
                  primary
                  label="Version imprimable"
                  fullWidth
                  onClick={() =>
                    window.open(
                      `/fournisseurs/${fournisseurId}/commandes/${commandeId}?print=true`,
                      '_blank'
                    )}
                />
              </div>
              <div className="col-md-3">
                <RaisedButton
                  primary
                  fullWidth
                  label="Facture"
                  onClick={() =>
                    window.open(
                      `/fournisseurs/${fournisseurId}/factures/${commandeId}?print=true`,
                      '_blank'
                    )}
                />
              </div>
            </div>}
          {this.props.children &&
            commandeUtilisateurs &&
            contenus &&
            commandeContenus &&
            React.cloneElement(this.props.children, {
              pending,
              commande: commandes.find(cde => cde.id === commandeId),
              params: this.props.params,
              commandeUtilisateurs,
              contenus,
              commandeContenus,
            })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  commandes: makeSelectFournisseurCommandes(),
  pending: makeSelectPending(),
  commandeContenus: makeSelectCommandeCommandeContenus(),
  contenus: makeSelectCommandeContenus(),
  commandeUtilisateurs: makeSelectCommandeCommandeUtilisateurs(),
  locationState: makeSelectLocationState(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadFournisseur,
      loadCde: loadCommandes,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  CommandesFournisseur
);
