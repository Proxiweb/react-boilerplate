import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { createStructuredSelector } from 'reselect';
import classnames from 'classnames';

import { selectCommandes } from 'containers/Commande/selectors';
import { loadUserCommandes, loadCommandes } from 'containers/Commande/actions';
import { selectPending } from 'containers/App/selectors';
import styles from './styles.css';

import DetailCommandeContainer from './components/DetailCommandeContainer';
import ListeCommandesUtilisateurContainer from './components/ListeCommandesUtilisateurContainer';

// eslint-disable-next-line
class HistoriqueCommandesUtilisateur extends Component {
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    commandeId: PropTypes.string,
    commandes: PropTypes.object,
    commandeUtilisateurs: PropTypes.object,
    pending: PropTypes.bool.isRequired,
    onSelectCommande: PropTypes.func.isRequired,
  };

  render() {
    const {
      commandeId,
      utilisateurId,
      pending,
      onSelectCommande,
    } = this.props;

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <ListeCommandesUtilisateurContainer
            utilisateurId={utilisateurId}
            onSelectCommande={onSelectCommande}
            pending={pending}
          />
        </div>
        <div className={classnames('col-md-9', styles.panel, styles.noScroll)}>
          {pending &&
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
            </div>}
          {commandeId &&
            !pending &&
            <DetailCommandeContainer
              commandeId={commandeId}
              utilisateurId={utilisateurId}
              pending={pending}
            />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandes: selectCommandes(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandesUtilisateur: loadUserCommandes,
      loadCommande: loadCommandes,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HistoriqueCommandesUtilisateur);
