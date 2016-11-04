/**
*
* App.react.js
*
* This component is the skeleton around the actual pages, and should only
* contain code that should be seen on all pages. (e.g. navigation bar)
*
* NOTE: while this component should technically be a stateless functional
* component (SFC), hot reloading does not currently support SFCs. If hot
* reloading is not a neccessity for you then you can refactor it and remove
* the linting exception.
*/

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Navbar from 'react-bootstrap/lib/Navbar';
import { Link } from 'react-router';
// import { Nav, NavItem } from 'react-bootstrap';
import styles from './styles.css';
import Notifications from 'containers/Notifications';
import { push } from 'react-router-redux';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Close from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

const getDrawerHeaderStyle = (context) => {
  const {
    appBar,
  } = context.muiTheme;
  return {
    color: 'white',
    backgroundColor: appBar.color,
    height: appBar.height,
    fontSize: 24,
    paddingTop: 0,
    lineHeight: `${appBar.height}px`,
  };
};

class App extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    user: PropTypes.object,
    pushState: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  toggleDrawer = () => {
    this.setState({ ...this.state, drawerOpen: !this.state.drawerOpen });
  }

  closeDrawer = () => {
    console.log('close');
    this.setState({ ...this.state, drawerOpen: false });
  }

  navigateTo = (url) => {
    console.log(url);
    this.closeDrawer();
    this.props.pushState(url);
  }

  buildMenuItem = (label, url) => <MenuItem primaryText={label} onTouchTap={() => this.navigateTo(url)} containerElement={<Link to={url}>{label}</Link>} />;

  render() {
    const { user } = this.props;
    return (
      <div className={styles.allContent}>
        <AppBar
          title="ProxiWeb"
          docked={false}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.toggleDrawer}
        />
        <div className={`${styles.mainContent} container-fluid`}>
          {React.Children.toArray(this.props.children)}
        </div>
        <Drawer open={this.state.drawerOpen} onRequestChange={this.closeDrawer}>
          <MenuItem primaryText="Menu" rightIcon={<Close />} onTouchTap={this.closeDrawer} style={getDrawerHeaderStyle(this.context)} />
          {this.buildMenuItem('Accueil', '/')}
          {user && user.relaiId && this.buildMenuItem('Commandes', `/relais/${user.relaiId}/commandes`)}
          {this.buildMenuItem('Stellar', '/stellar')}
          {user && this.buildMenuItem('Votre compte', '/votre-compte')}
          {!user && this.buildMenuItem('Connexion', '/login')}
        </Drawer>
        <Notifications />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect((state) => ({ user: state.compteUtilisateur.auth }), mapDispatchToProps)(App);
