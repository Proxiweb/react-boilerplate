import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import classnames from 'classnames';

import { List, ListItem, makeSelectable } from 'material-ui/List';

import DetailCommandeContainer from './components/DetailCommandeContainer';
import { selectUserIdCommandes, selectCommandeId } from 'containers/Commande/selectors';
import { loadUserCommandes, loadCommandes } from 'containers/Commande/actions';
import { selectUserId } from 'containers/CompteUtilisateur/selectors';
import { selectPending } from 'containers/App/selectors';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class HistoriqueCommandes extends Component {  // eslint-disable-line
  static propTypes = {
    userId: PropTypes.string.isRequired,
    commandeId: PropTypes.string,
    commandes: PropTypes.array,
    params: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,

    loadCommandesUtilisateur: PropTypes.func.isRequired,
    loadCommande: PropTypes.func.isRequired,
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { userId, loadCommandesUtilisateur } = this.props;
    loadCommandesUtilisateur(userId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.commandeId !== nextProps.params.commandeId) {
      this.props.loadCommande({ id: nextProps.params.commandeId });
    }
  }

  handleChangeList = (event, value) =>
    this.props.pushState(
      `/users/${this.props.params.userId}/commandes/${value}`
    );

  render() {
    const {
      commandes,
      children,
      commandeId,
      params,
      pending,
    } = this.props;
    if (!commandes) return null;
    const commande = commandeId ? commandes.find((cde) => cde.id === commandeId) : null;

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <SelectableList value={commande} onChange={this.handleChangeList}>
            {commandes.map((cde, idx) =>
              <ListItem
                key={idx}
                primaryText={moment(cde.dateCommande).format('LL')}
                value={cde.id}
              />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-9', styles.panel, styles.noScroll)}>
          {!children && !pending && <h1>Historique de vos commandes</h1>}
          {pending && (
            <div className="row center-md">
              <div className="col-md-4">
                <RefreshIndicator
                  size={70}
                  left={0}
                  top={20}
                  status="loading"
                  style={{ display: 'inline-block', position: 'relative' }}
                />
              </div>
            </div>
          )}
          {children && commande && !pending &&
            <h3>Commande {commande.resume || commande.noCommande}</h3>}
          {commandeId && !pending &&
            <DetailCommandeContainer commandeId={commandeId} params={params} />}
        </div>
      </div>
      );
  }
}

const mapStateToProps = createStructuredSelector({
  userId: selectUserId(),
  commandeId: selectCommandeId(),
  commandes: selectUserIdCommandes(),
  pending: selectPending(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadCommandesUtilisateur: loadUserCommandes,
  loadCommande: loadCommandes,
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HistoriqueCommandes);
