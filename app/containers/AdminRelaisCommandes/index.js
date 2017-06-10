import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import RefreshIndicator from 'material-ui/RefreshIndicator';

import { selectPending } from 'containers/App/selectors';

import { format } from 'utils/dates';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import classnames from 'classnames';

import { loadCommandes, loadFournisseurs, loadUtilisateurs, loadRelais } from 'containers/Commande/actions';

import { selectCommandes, selectCommandeId, selectRelaisSelected } from 'containers/Commande/selectors';

import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import SearchIcon from 'material-ui/svg-icons/action/search';
import DoneIcon from 'material-ui/svg-icons/action/done';

import MenuItem from 'material-ui/MenuItem';

import CommandeListeTypesProduits from './components/CommandeListeTypesProduits';

import DetailCommandeWrapper from './components/DetailCommandeWrapper';
import NewCommandeButton from './components/NewCommandeButton';
import ListeCommandes from './components/ListeCommandes';

import styles from './styles.css';

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object,
    pending: PropTypes.bool.isRequired,
    relais: PropTypes.object,
    commandeId: PropTypes.string,
    loadCommandes: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {
      typeCommandeListees: 0,
      recentesLoaded: false,
      rechercheLoaded: false,
    };
  }

  componentDidMount() {
    const { relaiId } = this.props.params;
    if (!this.props.relais) {
      this.props.loadRelais();
    }

    this.props.loadCommandes({
      relaiId,
      periode: 'precise',
      debut: format(subMonths(new Date(), 1)),
      fin: format(addMonths(new Date(), 1)),
    });

    this.props.loadFournisseurs({ relaiId });
    this.props.loadUtilisateurs({ relaiId });
  }

  render() {
    const { commandes, params, relais, pending, children } = this.props;
    const { action, commandeId, relaiId } = params;

    if (!commandes) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          {!children &&
            <NewCommandeButton commandeId={commandeId} action={action} params={params} relaiId={relaiId} />}
          {commandes &&
            <ListeCommandes params={params} commandes={commandes} relais={relais} pending={pending} />}
        </div>
        {this.props.children &&
          <DetailCommandeWrapper commandes={commandes} params={params} relais={relais}>
            {React.cloneElement(this.props.children, {
              commandes,
              params,
              relais,
            })}

          </DetailCommandeWrapper>}
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
  commandes: selectCommandes(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandes,
      loadUtilisateurs,
      loadFournisseurs,
      loadRelais,
      // pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelaisCommandes);
