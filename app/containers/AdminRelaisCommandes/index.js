import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { selectPending } from 'containers/App/selectors';

import moment from 'moment';
import classnames from 'classnames';

import {
  loadCommandes,
  loadFournisseurs,
  loadUtilisateurs,
  loadRelais,
  deleteCommande,
} from 'containers/Commande/actions';

import {
  selectCommandes,
  selectLivraisons,
  selectCommandeId,
  selectRelaisSelected,
} from 'containers/Commande/selectors';

import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import SearchIcon from 'material-ui/svg-icons/action/search';
import DoneIcon from 'material-ui/svg-icons/action/done';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import CommandeListeTypesProduits from './components/CommandeListeTypesProduits';

import styles from './styles.css';

const SelectableList = makeSelectable(List);

const iconButtonElement = (
  <IconButton touch tooltip="Plus..." tooltipPosition="bottom-left">
    <MoreVertIcon color="gray" />
  </IconButton>
);

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object,
    livraisons: PropTypes.object,
    pending: PropTypes.bool.isRequired,
    relais: PropTypes.object,
    commandeId: PropTypes.string,
    loadCommandes: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
    deleteCommande: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  static filtres = [() => true, (commandeId, commandes) => commandes[commandeId].finalisation, () => true];

  constructor(props) {
    super(props);
    this.state = {
      typeCommandeListees: 0,
      recentesLoaded: false,
      rechercheLoaded: false,
    };
  }

  componentDidMount() {
    const { relaiId } = this.props.params;
    if (!this.props.relais) {
      this.props.loadRelais();
    }

    this.props.loadCommandes({
      relaiId,
      periode: 'precise',
      debut: moment().subtract(1, 'months').toISOString(),
      fin: moment().add(1, 'months').toISOString(),
    });

    this.props.loadFournisseurs();
    this.props.loadUtilisateurs({ relaiId });
  }

  newCommande = () => {
    this.props.pushState(`/admin/relais/${this.props.params.relaiId}/commandes/nouvelle`);
  };

  editCommande = () => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/edit`);
  };

  removeCommande = id => {
    if (confirm('Supprimer cette commande')) {
      this.props.deleteCommande(id);
    }
  };

  handleChangeList = (event, value) => {
    const { relaiId, action } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${value}${action === 'edit' ? '/edit' : ''}`);
  };

  handleChangeFiltre = typeCommandeListees => {
    if (typeCommandeListees === 1 && !this.state.recentesLoaded) {
      this.props.loadCommandes({
        relaiId: this.props.params.relaiId,
        periode: 'precise',
        debut: moment().subtract(3, 'months').toISOString(),
        fin: moment().toISOString(),
      });
    }
    this.setState({ ...this.state, typeCommandeListees, recentesLoaded: true });
  };

  buildRightIcon = (commandeId, relaiId, commande) => {
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        {!commande.finalisation &&
          <MenuItem
            onClick={() => this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/edit`)}
          >
            Modifier
          </MenuItem>}
        {commande.finalisation &&
          <MenuItem
            onClick={() =>
              this.props.pushState(`/distributeurs/${relaiId}/factures/${commandeId}?print=true`)}
          >
            Facture
          </MenuItem>}
        {commande.commandeUtilisateurs.length === 0 &&
          <MenuItem onClick={() => this.removeCommande(commandeId)}>
            Supprimer
          </MenuItem>}
      </IconMenu>
    );
  };

  render() {
    const { commandes, livraisons, params, relais, pending } = this.props;
    const { action, commandeId, relaiId } = params;

    if (!commandes || !livraisons) return null;

    const commande = commandes ? commandes[commandeId] : null;

    let commandesFiltredIds = null;
    switch (this.state.typeCommandeListees) {
      case 0:
        commandesFiltredIds = Object.keys(commandes).filter(
          id => commandes[id].dateCommande === null || moment().isBefore(commandes[id].dateCommande)
        );
        break;
      case 1:
        commandesFiltredIds = Object.keys(commandes).filter(
          id => commandes[id].dateCommande !== null && moment().isAfter(commandes[id].dateCommande)
        );
        break;
      case 2:
        commandesFiltredIds = Object.keys(commandes);
        break;
      default:
        Object.keys(commandes);
    }

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <div style={{ textAlign: 'center' }}>
            {!commandeId &&
              !action &&
              <FloatingActionButton primary className={styles.addButton} onClick={this.newCommande}>
                <ContentAdd />
              </FloatingActionButton>}
          </div>
          {pending &&
            <div className={styles.liste}>
              <RefreshIndicator
                size={70}
                left={120}
                top={200}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </div>}
          {!pending &&
            <div className={styles.liste}>
              {commandesFiltredIds.length === 0 && <p>Aucune commande active</p>}
              {commandesFiltredIds.length > 0 &&
                <SelectableList value={commandeId} onChange={this.handleChangeList}>
                  {commandesFiltredIds
                    .filter(id => {
                      if (!commandes[id].livraisons) {
                        // eslint-disable-next-line
                        console.log(`La commande ${id} n'a pas de livraison`);
                        return false;
                      }
                      let inRelais = false;
                      commandes[id].livraisons.forEach(cmdeLivr => {
                        if (livraisons[cmdeLivr].relaiId === relaiId) {
                          inRelais = true;
                        }
                      });
                      return inRelais;
                    })
                    .sort(
                      (key1, key2) =>
                        !commandes[key1].dateCommande ||
                        moment(commandes[key1].dateCommande).unix() <
                          moment(commandes[key2].dateCommande).unix()
                    )
                    .map((key, idx) => (
                      <ListItem
                        key={idx}
                        primaryText={
                          commandes[key].dateCommande
                            ? moment(commandes[key].dateCommande).format('LLLL')
                            : 'date indéfinie'
                        }
                        secondaryText={<CommandeListeTypesProduits commande={commandes[key]} />}
                        value={key}
                        rightIconButton={this.buildRightIcon(key, relais.id, commandes[key])}
                      />
                    ))}
                </SelectableList>}
            </div>}
          <BottomNavigation selectedIndex={this.state.typeCommandeListees}>
            <BottomNavigationItem
              label="Actives"
              icon={<DoneIcon />}
              onTouchTap={() => this.handleChangeFiltre(0)}
            />
            <BottomNavigationItem
              label="Récentes"
              icon={<HistoryIcon />}
              onTouchTap={() => this.handleChangeFiltre(1)}
            />
            <BottomNavigationItem
              label="Chercher"
              icon={<SearchIcon />}
              onTouchTap={() => this.handleChangeFiltre(2)}
            />
          </BottomNavigation>
        </div>
        <div
          className={classnames(
            'col-md-9',
            styles.panel,
            { [styles.nouvelleCommande]: !commandeId },
            {
              [styles.noScroll]: !commandeId,
            }
          )}
        >
          {this.props.children &&
            React.cloneElement(this.props.children, {
              commande,
              commandes,
              commandeId,
              params,
              relais,
            })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
  commandes: selectCommandes(),
  livraisons: selectLivraisons(),
  commandeId: selectCommandeId(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandes,
      loadUtilisateurs,
      loadFournisseurs,
      deleteCommande,
      loadRelais,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelaisCommandes);
