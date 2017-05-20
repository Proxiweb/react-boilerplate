import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import moment from 'moment';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import { selectLocationState } from 'containers/App/selectors';

import { loadCommandes } from 'containers/Commande/actions';
import {
  selectCommandeCommandeUtilisateurs,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectCommandesRelais,
} from 'containers/Commande/selectors';

import styles from './styles.css';

const SelectableList = makeSelectable(List);

class FacturesDistributeur extends Component {
  static propTypes = {
    loadCde: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    locationState: PropTypes.object.isRequired,
    children: PropTypes.node,
    commandes: PropTypes.array,
    commandeUtilisateurs: PropTypes.array,
    commandeContenus: PropTypes.array,
  };

  componentDidMount() {
    const { params: { commandeId }, loadCde } = this.props;

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
      `/distributeurs/${this.props.params.relaiId}/factures/${value}`
    );
  };

  render() {
    const {
      commandes,
      params,
      commandeUtilisateurs,
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
            commandeContenus &&
            React.cloneElement(this.props.children, {
              commande: commandes[params.commandeId],
              params,
              commandeUtilisateurs,
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
              {Object.keys(commandes)
                .slice()
                .filter(id => commandes[id].dateCommande)
                .sort(
                  (a, b) =>
                    moment(a.dateCommande).unix() <
                    moment(b.dateCommande).unix()
                )
                .map((id, idx) => (
                  <ListItem
                    key={idx}
                    primaryText={moment(commandes[id].dateCommande).format(
                      'LL'
                    )}
                    value={id}
                  />
                ))}
            </SelectableList>
          </div>}
        <div
          className={classnames(print ? 'col-md-12' : 'col-md-9', styles.panel)}
        >
          {this.props.children &&
            commandeUtilisateurs &&
            commandeContenus &&
            React.cloneElement(this.props.children, {
              commande: commandes[params.commandeId],
              params,
              commandeUtilisateurs,
              commandeContenus,
            })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  commandes: selectCommandesRelais(),
  commandeContenus: selectCommandeContenus(),
  // contenus: selectCommandeContenus(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  locationState: selectLocationState(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCde: loadCommandes,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  FacturesDistributeur
);
