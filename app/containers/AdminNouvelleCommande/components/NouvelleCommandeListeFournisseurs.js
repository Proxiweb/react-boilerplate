import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

import DateLimiteDialog from './DateLimiteDialog';
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
    onModifDateLimiteFourn: PropTypes.func.isRequired,
  };

  state = {
    fournisseurSelectedId: null,
  };

  handleChangeList = (event, value) => this.props.addFourn(value);

  handleModif = fournisseurSelectedId =>
    this.setState({ fournisseurSelectedId });

  handleClose = () => this.setState({ fournisseurSelectedId: null });

  handleModifDate = (scope, value) => {
    const dateLimite = moment(this.getDateLimite())
      .format('YYYY-MM-DD HH:mm:ss')
      .split(' ');
    let heure = null;
    let date = null;
    if (scope === 'dateLimite') {
      heure = dateLimite[1];
      date = moment(value).format('YYYY-MM-DD');
    } else {
      date = dateLimite[0];
      heure = moment(value).format('HH:mm:ss');
    }
    this.props.onModifDateLimiteFourn(
      this.state.fournisseurSelectedId,
      moment(`${date} ${heure}`, 'YYYY-MM-DD HH:mm:ss').toISOString()
    );
  };

  getDateLimite = () =>
    this.state.fournisseurSelectedId
      ? this.props.datesLimites.find(
          f => f.fournisseurId === this.state.fournisseurSelectedId
        ).dateLimite
      : null;
  render() {
    const { fournisseurs, datesLimites, delFourn } = this.props;
    const { fournisseurSelectedId } = this.state;
    const dateLimite = this.getDateLimite();

    return (
      <div className={`row ${styles.panel}`}>
        <DateLimiteDialog
          open={fournisseurSelectedId !== null}
          handleClose={this.handleClose}
          changeDateLimite={this.handleModifDate}
          dateLimite={dateLimite}
        />
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
                .filter(dL => {
                  const fourn = fournisseurs.find(
                    f => f.id === dL.fournisseurId
                  );
                  return fourn && fourn.visible;
                })
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
                    rightIconButton={
                      <IconMenu
                        iconButtonElement={
                          <IconButton
                            touch
                            tooltip="Modifier la date limite"
                            tooltipPosition="bottom-left"
                          >
                            <MoreVertIcon color="gray" />
                          </IconButton>
                        }
                      >
                        <MenuItem
                          onClick={() => this.handleModif(dL.fournisseurId)}
                        >
                          Modifier
                        </MenuItem>
                        <MenuItem onClick={() => delFourn(dL.fournisseurId)}>
                          Supprimer
                        </MenuItem>
                      </IconMenu>
                    }
                  />
                ))}
            </SelectableList>
          </div>
        </div>
      </div>
    );
  }
}
