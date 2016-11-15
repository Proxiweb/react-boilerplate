import React, { Component, PropTypes } from 'react';

import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import GrilleIcon from 'material-ui/svg-icons/editor/border-all';
const SelectableList = makeSelectable(List);

export default class AppMainDrawer extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    onChangeList: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    header: PropTypes.node.isRequired,
    user: PropTypes.object,
  }
  render() {
    const { open, header, onRequestChangeNavDrawer, onChangeList, user } = this.props;
    return (
      <Drawer open={open} docked={false} onRequestChange={onRequestChangeNavDrawer}>
        {header}
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          <ListItem
            primaryText="Votre"
            primaryTogglesNestedList
            leftIcon={<ContentInbox />}
            nestedItems={[
              <ListItem primaryText="Tableau de bord" value="/dashboard/home" onTouchTap={this.props.onSelect} />,
              <ListItem primaryText="Tableau de bord mensuel" value="/dashboard/mensuel" />,
              <ListItem primaryText="Tableau de bord annuel" value="/dashboard/annuel" />,
            ]}
          />
          <ListItem
            primaryText="Véhicules Actifs"
            primaryTogglesNestedList
            leftIcon={<ActionCheckCircle />}
            nestedItems={[
              <ListItem primaryText="Assistant materiel" value="/wizard" />,
            ]}
          />
          <ListItem
            primaryText="États / catégorie"
            primaryTogglesNestedList
            leftIcon={<GrilleIcon />}
            nestedItems={[
              <ListItem primaryText="Tables matériel" value="/etats/materiel" />,
              <ListItem primaryText="Tables Carte Grises" value="/etats/cartes-grises" />,
            ]}
          />
          {user && <ListItem primaryText="Commandes" value={`/relais/${user.relaiId}/commandes`} />}
          {user && <ListItem primaryText="Votre compte" value="/votre-compte" />}
          {!user && <ListItem primaryText="Connexion" value="/login" />}
        </SelectableList>
      </Drawer>
    );
  }
}
