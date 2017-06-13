import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import styles from './styles.css';

class FournisseurRelais extends React.Component {
  static propTypes = {
    fournisseur: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    ajouteRelais: PropTypes.func.isRequired,
    retireRelais: PropTypes.func.isRequired,
  };
  render() {
    const { fournisseur, relais, retireRelais, ajouteRelais } = this.props;
    return (
      <div className="col-md-12">
        <div className="row">
          <div className={`col-md-6 ${styles.listeFournisseur}`}>
            <p className={styles.titre}>Inactifs</p>
            <List className={styles.liste}>
              {Object.keys(relais).map((id, idx) =>
                <ListItem
                  key={idx}
                  primaryText={relais[id].nom.toUpperCase()}
                  onClick={() => this.props.ajouteRelais(id)}
                />
              )}
            </List>
          </div>
          <div className={`col-md-6 ${styles.listeFournisseur}`}>
            <p className={styles.titre}>Actifs</p>
            <List className={styles.liste}>
              {fournisseur.relais.map((relaiFourn, idx) =>
                <ListItem
                  key={idx}
                  primaryText={relais[relaiFourn.id].nom.toUpperCase()}
                  onClick={() => this.props.retireRelais(relaiFourn.id)}
                />
              )}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default FournisseurRelais;
