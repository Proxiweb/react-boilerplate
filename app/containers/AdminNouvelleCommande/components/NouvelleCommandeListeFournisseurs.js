import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
const SelectableList = makeSelectable(List);
import styles from './styles.css';

export default class NouvelleCommandeListeFournisseurs extends Component {
  static propTypes = {
    fournisseurs: PropTypes.array.isRequired,
    fournisseursCommande: PropTypes.array.isRequired,
    addFourn: PropTypes.func.isRequired,
    delFourn: PropTypes.func.isRequired,
  }

  render() {
    const { fournisseurs, fournisseursCommande, addFourn, delFourn } = this.props;
    return (
      <div className={`row ${styles.panel}`}>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>Fournisseurs</h4>
          <div>
            <SelectableList value={location.pathname}>
              {fournisseurs.map((fourn, idx) =>
                <ListItem
                  key={idx}
                  primaryText={fourn.nom.toUpperCase()}
                  value={`${fourn.id}`}
                  onClick={() => addFourn({ id: fourn.id, nom: fourn.nom })}
                />
              )}
            </SelectableList>
          </div>
        </div>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>Fournisseurs de cette commande</h4>
          <div className={styles.panelo}>
            <SelectableList value={location.pathname}>
              {fournisseursCommande.map((fourn, idx) =>
                <ListItem
                  key={idx}
                  primaryText={fourn.nom.toUpperCase()}
                  value={`${fourn.id}`}
                  onClick={() => delFourn(fourn)}
                />
              )}
            </SelectableList>
          </div>
        </div>
      </div>
    );
  }
}
