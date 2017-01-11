import React, { Component, PropTypes } from 'react';

import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
// import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui/svg-icons/social/person';
import TestIcon from 'material-ui/svg-icons/action/settings';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import ListIcon from 'material-ui/svg-icons/action/list';
import HelpIcon from 'material-ui/svg-icons/action/help';
const SelectableList = makeSelectable(List);

export default class AppMainDrawer extends Component { // eslint-disable-line
  static propTypes = {
    // onSelect: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    onChangeList: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    header: PropTypes.node.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
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
              leftIcon={<ListIcon />}
              primaryText="Catalogue"
              value={`/catalogue/${user.relaiId}`}
            />
          )}
          {user && (
            <ListItem
              primaryText="Votre compte"
              primaryTogglesNestedList
              leftIcon={<PersonIcon />}
              nestedItems={[
                <ListItem primaryText="Profil" value={`/users/${user.id}/profile?tab=profil`} />,
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
                <ListItem primaryText="Depots" value="/depots" />,
                <ListItem
                  primaryText="Commandes"
                  value={`admin/relais/${user.relaiId}/commandes`}
                />,
                <ListItem primaryText="Logs" value="/logs" />,
                <ListItem primaryText="Utilisateurs" value="/utilisateurs" />,
                <ListItem
                  primaryText="Communication"
                  value="communications"
                  primaryTogglesNestedList
                  nestedItems={[
                    <ListItem primaryText="Passées" value="/communications/passees" />,
                    <ListItem primaryText="Courante" value="/communications/courante" />,
                  ]}
                />,
              ]}
            />
          )}
          {user && user.roles.includes('RELAI_ADMIN') && user.relaiId && (
            <ListItem
              primaryText="Relai Admin"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Commandes" value={`/admin/relais/${user.relaiId}/commandes`} />,
              ]}
            />
          )}
          {user.fournisseurId && (
            <ListItem
              primaryText="Admin Fournisseur"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Catalogue" value={`/fournisseurs/${user.fournisseurId}/catalogue`} />,
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
