import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
const SelectableList = makeSelectable(List);
import styles from './styles.css';

export default class NouvelleCommandeListeFournisseurs extends Component { // eslint-disable-line
  static propTypes = {
    fournisseurs: PropTypes.array.isRequired,
    fournisseursCommande: PropTypes.array.isRequired,
    addFourn: PropTypes.func.isRequired,
    delFourn: PropTypes.func.isRequired,
  }

  handleChangeList = (event, value) =>
    this.props.addFourn({ id: value.id, nom: value.nom, visible: value.visible });

  render() {
    const { fournisseurs, fournisseursCommande, delFourn } = this.props;
    return (
      <div className={`row ${styles.panel}`}>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>Fournisseurs</h4>
          <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <SelectableList value={location.pathname} onChange={this.handleChangeList}>
              {fournisseurs.map((fourn, idx) =>
                <ListItem
                  key={idx}
                  primaryText={fourn.nom.toUpperCase()}
                  value={fourn}
                />
              )}
            </SelectableList>
          </div>
        </div>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>Fournisseurs de cette commande</h4>
          <div className={styles.panelo}>
            <SelectableList value={location.pathname}>
              {fournisseursCommande.filter((f) => f.visible).map((fourn, idx) =>
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
