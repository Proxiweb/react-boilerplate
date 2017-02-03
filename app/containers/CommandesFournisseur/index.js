import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';

import { loadCommandes } from 'containers/Commande/actions';
import {
  selectCommandeCommandeUtilisateurs,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseurCommandes,
 } from 'containers/Commande/selectors';
import { selectLocationState } from 'containers/App/selectors';

import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CommandesFournisseur extends Component {
  static propTypes = {
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
  }

  componentDidMount() {
    const {
      params: { fournisseurId, commandeId },
      load,
      loadCde,
    } = this.props;

    load(fournisseurId);
    loadCde(commandeId);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.params.commandeId !== this.props.params.commandeId) {
      this.props.loadCde(nextProps.params.commandeId);
    }
  }

  handleChangeList = (event, value) => {
    this.props.loadCde(value);
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/commandes/${value}`
    );
  }

  render() {
    const {
      commandes,
      params: { commandeId, fournisseurId },
      commandeUtilisateurs,
      contenus,
      locationState,
      commandeContenus,
    } = this.props;

    if (!commandes) return null;
    const print = locationState.locationBeforeTransitions.query.print;
    return (
      <div className="row">
        {!print &&
          <div className={classnames('col-md-3', styles.panel)}>
            <SelectableList value={commandeId} onChange={this.handleChangeList}>
              {commandes.slice().filter((cde) => cde.dateCommande).sort((a, b) => moment(a.dateCommande).unix() < moment(b.dateCommande).unix()).map((cde, idx) =>
                <ListItem
                  key={idx}
                  primaryText={moment(cde.dateCommande).format('LL')}
                  value={cde.id}
                />
              )}
            </SelectableList>
          </div>
        }
        <div className={classnames(print ? 'col-md-12' : 'col-md-9', styles.panel)}>
          {!print &&
            <div className="row around-md">
              <div className="col-md-3">
                <RaisedButton
                  primary
                  label="Version imprimable"
                  fullWidth
                  onClick={
                    () => window.open(
                      `/fournisseurs/${fournisseurId}/commandes/${commandeId}?print=true`,
                      '_blank'
                    )
                  }
                />
              </div>
              <div className="col-md-3">
                <RaisedButton
                  primary
                  fullWidth
                  label="Facture"
                  onClick={
                    () => window.open(
                      `/fournisseurs/${fournisseurId}/factures/${commandeId}?print=true`,
                      '_blank'
                    )
                  }
                />
              </div>
            </div>
          }
          {
            this.props.children &&
            commandeUtilisateurs &&
            contenus &&
            commandeContenus &&
            React.cloneElement(
              this.props.children, {
                commande: commandes.find((cde) => cde.id === commandeId),
                params: this.props.params,
                commandeUtilisateurs,
                contenus,
                commandeContenus,
              }
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  commandes: selectFournisseurCommandes(),
  commandeContenus: selectCommandeCommandeContenus(),
  contenus: selectCommandeContenus(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  locationState: selectLocationState(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadFournisseur,
  loadCde: loadCommandes,
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CommandesFournisseur);
