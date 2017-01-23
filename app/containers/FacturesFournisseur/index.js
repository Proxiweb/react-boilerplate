import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
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

import styles from './styles.css';

const SelectableList = makeSelectable(List);

class FacturesFournisseur extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    loadCde: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
    commandes: PropTypes.array,
    commandeUtilisateurs: PropTypes.array,
    commandeContenus: PropTypes.array,
    contenus: PropTypes.object,
  }

  componentDidMount() {
    this.props.load(this.props.params.fournisseurId);
  }

  handleChangeList = (event, value) => {
    this.props.loadCde(value);
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/factures/${value}`
    );
  }

  render() {
    const {
      commandes,
      params,
      commandeUtilisateurs,
      contenus,
      commandeContenus,
    } = this.props;

    if (!commandes) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <SelectableList value={params.commandeId} onChange={this.handleChangeList}>
            {commandes.map((cde, idx) =>
              <ListItem
                key={idx}
                primaryText={moment(cde.dateCommande).format('LL')}
                value={cde.id}
              />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-10', styles.panel)}>
          {
            this.props.children &&
            commandeUtilisateurs &&
            contenus &&
            commandeContenus &&
            React.cloneElement(
              this.props.children, {
                commande: commandes.find((cde) => cde.id === params.commandeId),
                params,
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
});

const mapDispatchToProps = (dispatch) => ({
  load: (id) => dispatch(loadFournisseur(id)),
  loadCde: (id) => dispatch(loadCommandes({ id })),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacturesFournisseur);
