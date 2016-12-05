import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import classnames from 'classnames';

import { List, ListItem, makeSelectable } from 'material-ui/List';

import DetailCommandeContainer from './components/DetailCommandeContainer';
import { selectUserIdCommandes, selectCommandeId } from 'containers/Commande/selectors';
import { loadUserCommandes } from 'containers/Commande/actions';
import { selectUserId } from 'containers/CompteUtilisateur/selectors';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class HistoriqueCommandes extends Component {  // eslint-disable-line
  static propTypes = {
    userId: PropTypes.string.isRequired,
    commandeId: PropTypes.string.isRequired,
    commandes: PropTypes.array,
    params: PropTypes.object.isRequired,

    loadCommandesUtilisateur: PropTypes.func.isRequired,
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { userId, loadCommandesUtilisateur } = this.props;
    loadCommandesUtilisateur(userId);
  }

  render() {
    const {
      commandes,
      children,
      pushState,
      userId,
      commandeId,
      params,
    } = this.props;
    if (!commandes) return null;
    const commande = commandeId ? commandes.find((cde) => cde.id === commandeId) : null;
    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <SelectableList value={location.pathname}>
            {commandes.map((cde, idx) =>
              <ListItem
                key={idx}
                primaryText={moment(cde.dateCommande).format('LLL')}
                value={`/users/${userId}/commandes/${cde.id}`}
                onClick={() => pushState(`/users/${userId}/commandes/${cde.id}`)}
              />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-9', styles.panel, styles.noScroll)}>
          {!children && <h1>Historique de vos commandes</h1>}
          {children && commande && <h3>Commande {commande.resume || commande.noCommande}</h3>}
          {commandeId && <DetailCommandeContainer commandeId={commandeId} params={params} />}
        </div>
      </div>
      );
  }
}

const mapStateToProps = createStructuredSelector({
  userId: selectUserId(),
  commandeId: selectCommandeId(),
  commandes: selectUserIdCommandes(),
});

const mapDispatchToProps = (dispatch) => ({
  loadCommandesUtilisateur: (utilisateurId) => dispatch(loadUserCommandes(utilisateurId)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoriqueCommandes);
