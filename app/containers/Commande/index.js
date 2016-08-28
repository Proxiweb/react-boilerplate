/*
 *
 * Commande
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { selectAsyncState, selectCommandesUtilisateur } from './selectors'; // selectCommandesUtilisateur
import styles from './styles.css';

import { loadCommandes, ajouter } from './actions';

export class Commande extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    commandes: PropTypes.array.isRequired,
    asyncState: PropTypes.object.isRequired,
    loadCommandes: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
  }

  render() {
    const { asyncState, commandes } = this.props;
    if (commandes && commandes.length > 0) {
      return (
        <div>
          {commandes.map(
            commande =>
              commande
                .commandeUtilisateurs
                .filter(cu => cu.utilisateur.id === 2)
                .map(cu => cu.contenus.map(cont => (
                  <button
                    className="btn btn-primary"
                    onClick={() => this.props.ajouter(cont.id, 1)}
                  >
                    Ajouter ({cont.quantite})
                  </button>)
                ))
            )}
        </div>);
    }

    return (
      <div className={styles.commande}>
        <Helmet
          title="Commande"
          meta={[
            { name: 'description', content: 'Description of Commande' },
          ]}
        />
        <h1>Commandes</h1>
        <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
          <button
            onClick={() => this.props.loadCommandes(0)}
            className="btn btn-primary"
          >
            <span>{ !asyncState.pending && 'Charger les commandes, page 0'} { asyncState.pending && 'loading...' }</span>
          </button>
        </div>
        <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
          <button
            onClick={() => this.props.loadCommandes(1)}
            className="btn btn-primary"
          >
            <span>{ !asyncState.pending && 'Charger les commandes, page 1'} { asyncState.pending && 'loading...' }</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  // commandes: selectCommandesUtilisateur(1),
  commandes: selectCommandesUtilisateur(2),
  asyncState: selectAsyncState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadCommandes: (page) => dispatch(loadCommandes(page)),
    ajouter: (contenuId, qte) => dispatch(ajouter(contenuId, qte)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commande);
