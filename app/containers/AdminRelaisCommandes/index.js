import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
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
  selectCommandesRelais,
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
  <IconButton
    touch
    tooltip="Plus..."
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color="gray" />
  </IconButton>
);

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object,
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
  }

  constructor(props) {
    super(props);
    this.state = {
      typeCommandeListees: 0,
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
      fin: moment().toISOString(),
    });
    this.props.loadFournisseurs();
    this.props.loadUtilisateurs({ relaiId });
  }

  componentWillReceiveProps(nextProps) {
    console.log('props', nextProps);
  }

  newCommande = () => {
    this.props.pushState(`/admin/relais/${this.props.params.relaiId}/commandes/nouvelle`);
  }

  editCommande = () => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/edit`);
  }

  removeCommande = (id) => {
    if (confirm('Supprimer cette commande')) {
      this.props.deleteCommande(id);
    }
  }

  handleChangeList = (event, value) => {
    const { relaiId, action } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${value}${action === 'edit' ? '/edit' : ''}`);
  }

  buildRightIcon = (commandeId, relaiId, commande) => {
    if (commande.finalisation) return null;
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem
          onClick={
            () => this.props.pushState(
              `/admin/relais/${relaiId}/commandes/${commandeId}/edit`
            )
          }
        >
          Modifier
        </MenuItem>
        { commande.commandeUtilisateurs.length === 0 &&
          <MenuItem onClick={() => this.removeCommande(commandeId)}>
            Supprimer
          </MenuItem>
        }
      </IconMenu>
    );
  }

  render() {
    const { commandes, params, relais } = this.props;
    const { action, commandeId } = params;
    console.log('render', commandes);
    if (!commandes) return null;
    const commande = commandes ? commandes[commandeId] : null;

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <div style={{ textAlign: 'center' }}>
            {!commandeId && !action &&
              <FloatingActionButton
                primary
                className={styles.addButton}
                onClick={this.newCommande}
              >
                <ContentAdd />
              </FloatingActionButton>
            }
          </div>
          <SelectableList value={commandeId} onChange={this.handleChangeList} className={styles.liste}>
            {Object.keys(commandes)
              .sort((key1, key2) =>
                !commandes[key1].dateCommande ||
                moment(commandes[key1].dateCommande).unix() < moment(commandes[key2].dateCommande).unix()
              )
              .map((key, idx) =>
                <ListItem
                  key={idx}
                  primaryText={
                    commandes[key].dateCommande
                    ? moment(commandes[key].dateCommande).format('LLLL')
                    : 'date indéfinie'
                  }
                  secondaryText={
                    <CommandeListeTypesProduits commande={commandes[key]} />
                  }
                  value={key}
                  rightIconButton={this.buildRightIcon(key, relais.id, commandes[key])}
                />
            )}
          </SelectableList>
          <BottomNavigation selectedIndex={this.state.typeCommandeListees}>
            <BottomNavigationItem
              label="Actives"
              icon={<DoneIcon />}
              onTouchTap={() => this.setState({ typeCommandeListees: 0 })}
            />
            <BottomNavigationItem
              label="Récentes"
              icon={<HistoryIcon />}
              onTouchTap={() => this.setState({ typeCommandeListees: 1 })}
            />
            <BottomNavigationItem
              label="Chercher"
              icon={<SearchIcon />}
              onTouchTap={() => this.setState({ typeCommandeListees: 2 })}
            />
          </BottomNavigation>
        </div>
        <div
          className={
            classnames(
              'col-md-9',
              styles.panel,
              { [styles.nouvelleCommande]: !commandeId },
              { [styles.noScroll]: !commandeId },
            )
          }
        >
          {this.props.children &&
            React.cloneElement(
              this.props.children,
              { commande, commandes, commandeId, params, relais }
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
  commandes: selectCommandesRelais(),
  commandeId: selectCommandeId(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadCommandes,
  loadUtilisateurs,
  loadFournisseurs,
  deleteCommande,
  loadRelais,
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelaisCommandes);
