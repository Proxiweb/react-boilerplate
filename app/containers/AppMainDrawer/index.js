import React, { Component, PropTypes } from 'react';

import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui/svg-icons/social/person';
import TestIcon from 'material-ui/svg-icons/action/settings';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import HelpIcon from 'material-ui/svg-icons/action/help';
const SelectableList = makeSelectable(List);

export default class AppMainDrawer extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    onChangeList: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    header: PropTypes.node.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
  }
  render() {
    const { open, header, onRequestChange, onChangeList, user } = this.props;
    return (
      <Drawer open={open} docked={false} onRequestChange={onRequestChange}>
        {header}
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          {user && (
            <ListItem
              leftIcon={<ShoppingCartIcon />}
              primaryText="Commandes"
              value={`/relais/${user.relaiId}/commandes`}
            />
          )}
          {user && (
            <ListItem
              primaryText="Votre compte"
              primaryTogglesNestedList
              leftIcon={<PersonIcon />}
              nestedItems={[
                <ListItem primaryText="Profil" value={`/users/${user.id}/profile`} />,
                <ListItem primaryText="Notifications" value={`/users/${user.id}/notifications`} />,
                <ListItem primaryText="Historique" value={`/users/${user.id}/commandes`} />,
                <ListItem primaryText="Porte monnaie" value={`/users/${user.id}/porte-monnaie`} />,
              ]}
            />
          )}
          {user && user.roles.includes('ADMIN') && (
            <ListItem
              primaryText="Admin Proxiweb"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Relais" value="/relais" />,
                <ListItem primaryText="Depots" value="depots" />,
                <ListItem primaryText="Commandes" value="commandes" />,
                <ListItem primaryText="Logs" value="logs" />,
                <ListItem primaryText="Utilisateurs" value="utilisateurs" />,
                <ListItem primaryText="Communication" value="communications" />,
              ]}
            />
          )}
          {user && <ListItem leftIcon={<HelpIcon />} primaryText="Aide" value={`/users/${user.id}/aide`} />}
          {!user && <ListItem primaryText="Connexion" value="/login" />}
          {user && (
            <ListItem
              primaryText="Déconnexion"
              onTouchTap={() => this.props.logout()}
              value="/"
            />)}
        </SelectableList>
      </Drawer>
    );
  }
}
