import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import classnames from 'classnames';

import {
  selectCommandeProduits,
  selectProduits,
  selectOffres,
  selectQuantiteOffresAchetees,
  selectUserIdCommandeUtilisateur,
  selectUserIdCommandes,
  selectCommandeId,
} from 'containers/Commande/selectors';

import { loadUserCommandes, loadCommande } from 'containers/Commande/actions';
import { selectUserId } from 'containers/CompteUtilisateur/selectors';
import styles from './styles.css';

class HistoriqueCommandes extends Component {  // eslint-disable-line
  static propTypes = {
    userId: PropTypes.string.isRequired,
    commandeId: PropTypes.string.isRequired,
    loadCommandesUtilisateur: PropTypes.func.isRequired,
    loadCommande: PropTypes.func.isRequired,
    commandes: PropTypes.array.isRequired,
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { userId, loadCommandesUtilisateur } = this.props;
    loadCommandesUtilisateur(userId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.commandeId !== nextProps.commandeId) {
      this.props.loadCommande(nextProps.commandeId);
    }
  }

  render() {
    const {
      commandes,
      children,
      pushState,
      userId,
      commandeId,
      produits,
      offres,
      offresUtilisateur,
      commandeUtilisateurs,
    } = this.props;
    if (!commandes) return null;
    console.log(produits, offres, offresUtilisateur, commandeUtilisateurs);
    const commande = commandeId ? commandes.find((cde) => cde.id === commandeId) : null;
    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <List>
            {commandes.map((cde, idx) =>
              <ListItem
                key={idx}
                primaryText={moment(cde.dateCommande).format('LLL')}
                onClick={() => pushState(`/users/${userId}/commandes/${cde.id}`)}
              />
            )}
          </List>
        </div>
        <div className={classnames('col-md-9', styles.panel, styles.noScroll)}>
          {!children && <h1>Historique de vos commandes</h1>}
          {children && commande && <h1>Commande {commande.noCommande}</h1>}
        </div>
      </div>
      );
  }
}

const mapStateToProps = createStructuredSelector({
  userId: selectUserId(),
  commandeId: selectCommandeId(),
  commandes: selectUserIdCommandes(),

  produits: selectCommandeProduits(),
  offres: selectOffres(),
  offresUtilisateur: selectQuantiteOffresAchetees(),
  commandeUtilisateur: selectUserIdCommandeUtilisateur(),
});

const mapDispatchToProps = (dispatch) => ({
  loadCommandesUtilisateur: (utilisateurId) => dispatch(loadUserCommandes(utilisateurId)),
  loadCommande: (id) => dispatch(loadCommande(id)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoriqueCommandes);
