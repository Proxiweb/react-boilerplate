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
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import runtime from 'offline-plugin/runtime';
import styles from './styles.css';
import Notifications from 'containers/Notifications';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import NavigationMenuIcon from 'material-ui/svg-icons/navigation/menu';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import AppMainDrawer from 'containers/AppMainDrawer';

import { selectBalance, selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

import {
  selectPending,
  selectMessagesUtilisateurLoaded,
  selectMessagesUtilisateur,
  selectRelaiId,
  selectLocationState,
} from './selectors';

import { loadMessages } from './actions';

import { logout } from 'containers/Login/actions';
import { refresh } from 'containers/CompteUtilisateur/actions';
import Logged from './components/Logged';
import Login from './components/Login';
import MessageMaj from './components/MessageMaj';

const getDrawerHeaderStyle = context => {
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

class App extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
    anonRelaiId: PropTypes.string,
    destinataires: PropTypes.array.isRequired,
    messagesLoaded: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    compte: PropTypes.object,
    locationState: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    pending: PropTypes.bool.isRequired,
    loadM: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    drawerOpen: false,
    maj: false,
    logged: false,
  };

  componentDidMount = () => {
    const { loadM, user, messagesLoaded } = this.props;

    if (user) {
      if (!messagesLoaded) {
        loadM({ a: user.id });
      }
      this.props.refresh(user.id);
    }

    runtime.install({
      onUpdating: () => {
        console.log('SW Event:', 'onUpdating');
      },
      onUpdateReady: () => {
        console.log('SW Event:', 'onUpdateReady');
        // Update is applied here
        runtime.applyUpdate();
      },
      onUpdated: () => {
        console.log('SW Event:', 'onUpdated');
        // Force reload happens here
        this.setState({ maj: true });
        setTimeout(window.location.reload(true), 5000);
      },

      onUpdateFailed: () => {
        console.log('SW Event:', 'onUpdateFailed');
      },
    });
  };

  toggleDrawer = () => this.setState({ ...this.state, drawerOpen: !this.state.drawerOpen });

  closeDrawer = () => this.setState({ ...this.state, drawerOpen: false });

  handleChangeList = (event, value) => {
    event.preventDefault();

    if (typeof value === 'string') {
      this.props.pushState(value);
    } else if (value.url) {
      window.location = value.url;
    }

    this.closeDrawer();
  };

  handleChangeRequestNavDrawer = open => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    const {
      user,
      pending,
      destinataires,
      pushState,
      compte,
      messages,
      anonRelaiId,
      locationState,
    } = this.props;

    const { muiTheme } = this.context;
    const drawerStyle = getDrawerHeaderStyle(this.context);
    let showPorteMonnaie = false;

    if (compte) {
      showPorteMonnaie = true;
    }

    const print = locationState.locationBeforeTransitions.query.print;

    if (print) {
      return <div>{React.Children.toArray(this.props.children)}</div>;
    }

    return (
      <div className={styles.allContent}>
        <Toolbar
          className={`${styles.noPrint} ${styles.toolbar}`}
          style={{
            backgroundColor: muiTheme.appBar.color,
            height: '50px',
          }}
        >
          <ToolbarGroup firstChild>
            <IconButton touch onClick={this.toggleDrawer} style={{ paddingRight: 0 }}>
              <NavigationMenuIcon />
            </IconButton>
            <FlatButton
              label="Relais ProxiWeb"
              style={{ color: 'black', marginLeft: 0, marginTop: 5 }}
              onClick={() => pushState('/')}
            />
            {pending &&
              <div style={{ position: 'relative' }}>
                <CircularProgress
                  size={20}
                  color="white"
                  status="loading"
                  style={{
                    display: 'inline-block',
                    position: 'absolute',
                    zIndex: 1200,
                    top: 19,
                    left: -35,
                  }}
                />
              </div>}
          </ToolbarGroup>
          {user
            ? <Logged
                messages={messages.filter(m => m.dateConsultation === null)}
                destinataires={destinataires}
                pushState={pushState}
              />
            : <Login onClick={this.handleChangeList} />}
        </Toolbar>
        <AppMainDrawer
          open={this.state.drawerOpen}
          onSelect={this.navigateTo}
          onChangeList={this.handleChangeList}
          user={user}
          showPorteMonnaie={showPorteMonnaie}
          onRequestChange={open => this.setState({ drawerOpen: open })}
          logout={this.props.logout}
          messages={messages}
          anonRelaiId={anonRelaiId}
          header={
            (
              <MenuItem
                primaryText="Menu"
                rightIcon={<Close color={drawerStyle.textColor} style={{ height: 40, width: 30 }} />}
                onTouchTap={this.closeDrawer}
                style={drawerStyle}
              />
            )
          }
        />
        <div className={`container-fluid ${styles.mainContent}`}>
          {!this.state.maj && React.Children.toArray(this.props.children)}
          {this.state.maj && <MessageMaj />}
        </div>
        <Notifications />
      </div>
    );
  }
}

const selectDestinaires = () => state => state.admin ? state.admin.communication.destinataires : [];

const mapStateToProps = createStructuredSelector({
  user: selectCompteUtilisateur(),
  pending: selectPending(),
  destinataires: selectDestinaires(),
  messagesLoaded: selectMessagesUtilisateurLoaded(),
  messages: selectMessagesUtilisateur(),
  compte: selectBalance(),
  anonRelaiId: selectRelaiId(),
  locationState: selectLocationState(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    pushState: push,
    logout,
    refresh,
    loadM: loadMessages,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
