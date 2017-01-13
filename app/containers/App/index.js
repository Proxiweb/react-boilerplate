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

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import styles from './styles.css';
import Notifications from 'containers/Notifications';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import Close from 'material-ui/svg-icons/navigation/close';

import AppBar from 'material-ui/AppBar';
import AppMainDrawer from 'containers/AppMainDrawer';

import {
  selectBalance,
  selectCompteUtilisateur,
} from 'containers/CompteUtilisateur/selectors';

import {
  selectPending,
} from './selectors';

import { logout } from 'containers/Login/actions';
import Logged from './components/Logged';
import Login from './components/Login';

const getDrawerHeaderStyle = (context) => {
  const {
    appBar,
  } = context.muiTheme;
  return {
    color: appBar.textColor,
    backgroundColor: appBar.color,
    height: appBar.height + 6,
    fontSize: 24,
    paddingTop: 0,
    lineHeight: `${appBar.height}px`,
  };
};

class App extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
    destinataires: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    compte: PropTypes.object,
    user: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    pending: PropTypes.bool.isRequired,
  }

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
    this.setState({ ...this.state, drawerOpen: false });
  }

  handleChangeList = (event, value) => {
    event.preventDefault();
    this.props.pushState(value);
    this.closeDrawer();
  }

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    const { user, pending, destinataires, pushState, compte } = this.props;
    const drawerStyle = getDrawerHeaderStyle(this.context);
    return (
      <div className={styles.allContent}>
        <AppBar
          title={<Link to={`/relais/${user.relaiId}/commandes`} style={{ textDecoration: 'none', color: 'black' }}>Relais ProxiWeb</Link>}
          onLeftIconButtonTouchTap={this.toggleDrawer}
          iconElementRight={user ? <Logged destinataires={destinataires} onClick={pushState} /> : <Login onClick={this.handleChangeList} />}
        >
          <AppMainDrawer
            open={this.state.drawerOpen}
            onSelect={this.navigateTo}
            onChangeList={this.handleChangeList}
            user={user}
            showPorteMonnaie={compte}
            onRequestChange={(open) => this.setState({ drawerOpen: open })}
            logout={this.props.logout}
            header={(
              <MenuItem
                primaryText="Menu"
                rightIcon={<Close color={drawerStyle.textColor} style={{ height: 40, width: 30 }} />}
                onTouchTap={this.closeDrawer}
                style={drawerStyle}
              />)}
          />
        </AppBar>
        <div className={`container-fluid ${styles.mainContent}`}>
          {React.Children.toArray(this.props.children)}
        </div>
        <Notifications />
        {pending && (
          <CircularProgress
            size={30}
            color="white"
            status="loading"
            style={{ display: 'inline-block', position: 'absolute', zIndex: 1200, top: '10px', left: '180px' }}
          />
        )}
      </div>
    );
  }
}

const selectDestinaires = () => (state) => (state.admin ? state.admin.communication.destinataires : []);

const mapStateToProps = createStructuredSelector({
  user: selectCompteUtilisateur(),
  pending: selectPending(),
  destinataires: selectDestinaires(),
  compte: selectBalance(),
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
