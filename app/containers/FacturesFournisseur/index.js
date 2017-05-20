import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import compareDesc from 'date-fns/compare_desc';
import { format } from 'utils/dates';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import { selectLocationState } from 'containers/App/selectors';

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
    loadCde({ id: commandeId });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.params.commandeId !== this.props.params.commandeId) {
      this.props.loadCde({ id: nextProps.params.commandeId });
    }
  };

  handleChangeList = (event, value) => {
    this.props.loadCde(value);
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/factures/${value}`
    );
  };

  render() {
    const {
      commandes,
      params,
      commandeUtilisateurs,
      contenus,
      commandeContenus,
      locationState,
    } = this.props;

    if (!commandes) return null;

    const print = locationState.locationBeforeTransitions.query.print;

    if (print) {
      return (
        <div>
          {this.props.children &&
            commandeUtilisateurs &&
            contenus &&
            commandeContenus &&
            React.cloneElement(this.props.children, {
              commande: commandes.find(cde => cde.id === params.commandeId),
              params,
              commandeUtilisateurs,
              contenus,
              commandeContenus,
            })}
        </div>
      );
    }

    return (
      <div className="row">
        {!print &&
          <div className={classnames('col-md-3', styles.panel)}>
            <SelectableList
              value={params.commandeId}
              onChange={this.handleChangeList}
            >
              {commandes
                .slice()
                .filter(cde => cde.dateCommande)
                .sort(compareDesc)
                .map((cde, idx) => (
                  <ListItem
                    key={idx}
                    primaryText={format(cde.dateCommande, 'DD MMMM')}
                    value={cde.id}
                  />
                ))}
            </SelectableList>
          </div>}
        <div
          className={classnames(print ? 'col-md-12' : 'col-md-9', styles.panel)}
        >
          {this.props.children &&
            commandeUtilisateurs &&
            contenus &&
            commandeContenus &&
            React.cloneElement(this.props.children, {
              commande: commandes.find(cde => cde.id === params.commandeId),
              params,
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
  commandes: selectFournisseurCommandes(),
  commandeContenus: selectCommandeCommandeContenus(),
  contenus: selectCommandeContenus(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  locationState: selectLocationState(),
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
  FacturesFournisseur
);
