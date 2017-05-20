import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import SearchIcon from 'material-ui/svg-icons/action/search';
import DoneIcon from 'material-ui/svg-icons/action/done';

import moment from 'moment';
import {
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui/BottomNavigation';

import { selectCommandeId } from 'containers/Commande/selectors';
import { loadCommandes } from 'containers/Commande/actions';
import ListeCommandeItem from './ListeCommandeItem';

import styles from './styles.css';
import classnames from 'classnames';
const SelectableList = makeSelectable(List);

class ListeCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object.isRequired,
    commandeId: PropTypes.string,
    loadCommandes: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      typeCommandeListees: 0,
      rechercheLoaded: false,
      offsetRecentes: 3, // 3 mois en arrière
    };
  }

  handleChangeFiltre = typeCommandeListees => {
    const { offsetRecentes } = this.state;
    if (typeCommandeListees === 1) {
      this.props.loadCommandes({
        relaiId: this.props.params.relaiId,
        periode: 'precise',
        debut: moment().subtract(offsetRecentes, 'months').toISOString(),
        fin: moment().subtract(offsetRecentes - 3, 'months').toISOString(),
      });
    }

    this.setState({
      ...this.state,
      typeCommandeListees,
      offsetRecentes: offsetRecentes + 3,
    });
  };

  buildListeCommandes = () => {
    const { commandes } = this.props;
    let commandesFiltredIds = null;
    switch (this.state.typeCommandeListees) {
      case 0:
        return Object.keys(commandes).filter(
          id =>
            commandes[id].dateCommande === null ||
            moment().isBefore(commandes[id].dateCommande)
        );
      case 1:
        return Object.keys(commandes).filter(
          id =>
            commandes[id].dateCommande !== null &&
            moment().isAfter(commandes[id].dateCommande)
        );
      case 2:
      default:
        return Object.keys(commandes);
    }
  };

  render() {
    const {
      pending,
      commandeId,
      commandes,
      relais,
      params: { relaiId },
    } = this.props;
    const commandesFiltredIds = this.buildListeCommandes();

    return (
      <div>
        {commandesFiltredIds.length > 0 &&
          <SelectableList
            value={commandeId}
            style={{
              minHeight: 'calc(100vh - 180px)',
              maxHeight: 'calc(100vh - 180px)',
              overflowY: 'auto',
            }}
          >
            {commandesFiltredIds
              .filter(
                id =>
                  typeof commandes[id].distributions.find(
                    d => d.relaiId === relaiId
                  ) !== 'undefined'
              )
              .sort(
                (key1, key2) =>
                  !commandes[key1].dateCommande ||
                  moment(commandes[key1].dateCommande).unix() <
                    moment(commandes[key2].dateCommande).unix()
              )
              .map((key, idx) => (
                <ListeCommandeItem
                  key={idx}
                  commande={commandes[key]}
                  relaiId={relais.id}
                />
              ))}
          </SelectableList>}
        {
          <div className={styles.liste}>
            {commandesFiltredIds.length === 0 && <p>Aucune commande active</p>}
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
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandes,
    },
    dispatch
  );

const mapStateToProps = createStructuredSelector({
  commandeId: selectCommandeId(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListeCommandes);
