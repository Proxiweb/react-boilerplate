import React, { Component } from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
// import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui/svg-icons/social/person';
import TestIcon from 'material-ui/svg-icons/action/settings';
import MailIcon from 'material-ui/svg-icons/communication/mail-outline';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import ListIcon from 'material-ui/svg-icons/action/list';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
// import HelpIcon from 'material-ui/svg-icons/action/help';
const SelectableList = makeSelectable(List);

export default class AppMainDrawer extends Component {
  // eslint-disable-line
  static propTypes = {
    onRequestChange: PropTypes.func.isRequired,
    onChangeList: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    header: PropTypes.node.isRequired,
    showPorteMonnaie: PropTypes.bool.isRequired,
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    logout: PropTypes.func.isRequired,
    anonRelaiId: PropTypes.string,
  };

  shouldComponentUpdate = nextProps =>
    this.props.user !== nextProps.user || this.props.open !== nextProps.open;

  render() {
    const { open, header, onRequestChange, onChangeList, user, showPorteMonnaie, anonRelaiId } = this.props;
    return (
      <Drawer open={open} docked={false} onRequestChange={onRequestChange}>
        {header}
        <SelectableList value={location.pathname} onChange={onChangeList}>
          {user && <ListItem leftIcon={<ShoppingCartIcon />} primaryText="Commandes" value={'/'} />}
          {anonRelaiId &&
            !user &&
            <ListItem
              leftIcon={<ListIcon />}
              primaryText="Catalogue"
              value={{
                url: `/catalogue/${anonRelaiId}`, // url dans obj provoque rechargement page
              }}
            />}
          {user &&
            <ListItem
              leftIcon={<ListIcon />}
              primaryText="Catalogue"
              value={{
                url: `/catalogue/${user.relaiId}`, // url dans obj provoque rechargement page
              }}
            />}
          {user &&
            <ListItem
              primaryText="Votre compte"
              primaryTogglesNestedList
              leftIcon={<PersonIcon />}
              nestedItems={[].concat(
                [
                  <ListItem primaryText="Profil" value={`/users/${user.id}/profile?tab=profil`} />,
                  <ListItem
                    primaryText="Historique"
                    value={{
                      url: `/users/${user.id}/commandes`,
                    }}
                  />,
                ],
                showPorteMonnaie
                  ? [<ListItem primaryText="Porte monnaie" value={`/users/${user.id}/porte-monnaie`} />]
                  : []
              )}
            />}
          {user &&
            user.roles &&
            includes(user.roles, 'ADMIN') &&
            <ListItem
              primaryText="Admin Proxiweb"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Tableau de bord" value="/proxiweb/dashboard" />,
                <ListItem primaryText="Paramétrage" value="/proxiweb/parametrage" />,
                <ListItem primaryText="Relais" value="/relais" />,
                <ListItem primaryText="Depots" value="/depots" />,
                <ListItem primaryText="Commandes" value={`/admin/relais/${user.relaiId}/commandes`} />,
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
            />}
          {user &&
            user.roles &&
            includes(user.roles, 'RELAI_ADMIN') &&
            user.relaiId &&
            <ListItem
              primaryText="Relai Admin"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Commandes" value={`/admin/relais/${user.relaiId}/commandes`} />,
                <ListItem primaryText="Relais" value={`/relais/${user.relaiId}`} />,
              ]}
            />}
          {user.fournisseurId &&
            <ListItem
              primaryText="Admin Fournisseur"
              primaryTogglesNestedList
              leftIcon={<TestIcon />}
              nestedItems={[
                <ListItem primaryText="Catalogue" value={`/fournisseurs/${user.fournisseurId}/catalogue`} />,
                <ListItem
                  primaryText="Commandes"
                  value={{
                    url: `/fournisseurs/${user.fournisseurId}/commandes`,
                  }}
                />,
                <ListItem primaryText="Infos" value={`/fournisseurs/${user.fournisseurId}/infos`} />,
              ]}
            />}
          {user && <ListItem leftIcon={<MailIcon />} primaryText="Nous contacter" value={'/support'} />}
          {!user && <ListItem primaryText="Connexion" value="/login" />}
          {user &&
            <ListItem
              primaryText="Déconnexion"
              leftIcon={<ExitIcon />}
              onTouchTap={() => this.props.logout()}
              value={{ url: null }}
            />}
        </SelectableList>
      </Drawer>
    );
  }
}
