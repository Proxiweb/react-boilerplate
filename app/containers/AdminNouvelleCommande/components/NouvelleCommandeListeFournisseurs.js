import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import moment from 'moment';
const SelectableList = makeSelectable(List);
import styles from './styles.css';

export default class NouvelleCommandeListeFournisseurs extends Component {
  // eslint-disable-line
  static propTypes = {
    fournisseurs: PropTypes.array.isRequired,
    datesLimites: PropTypes.array.isRequired,
    addFourn: PropTypes.func.isRequired,
    delFourn: PropTypes.func.isRequired,
  };

  handleChangeList = (event, value) => this.props.addFourn(value);

  render() {
    const { fournisseurs, datesLimites, delFourn } = this.props;

    return (
      <div className={`row ${styles.panel}`}>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>Fournisseurs</h4>
          <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <SelectableList
              value={location.pathname}
              onChange={this.handleChangeList}
            >
              {fournisseurs
                .filter(
                  f => !datesLimites.find(dL => dL.fournisseurId === f.id)
                )
                .map((fourn, idx) => (
                  <ListItem
                    key={idx}
                    primaryText={fourn.nom.toUpperCase()}
                    value={fourn.id}
                  />
                ))}
            </SelectableList>
          </div>
        </div>
        <div className="col-md">
          <h4 style={{ textAlign: 'center' }}>
            Fournisseurs de cette commande
          </h4>
          <div className={styles.panelo}>
            <SelectableList value={location.pathname}>
              {datesLimites
                .filter(
                  dL =>
                    fournisseurs.find(f => f.id === dL.fournisseurId).visible
                )
                .map((dL, idx) => (
                  <ListItem
                    key={idx}
                    primaryText={fournisseurs
                      .find(f => f.id === dL.fournisseurId)
                      .nom.toUpperCase()}
                    value={`${dL.fournisseurId}`}
                    secondaryText={
                      dL.dateLimite ? moment(dL.dateLimite).format('LLL') : null
                    }
                    onClick={() => delFourn(dL.fournisseurId)}
                  />
                ))}
            </SelectableList>
          </div>
        </div>
      </div>
    );
  }
}
