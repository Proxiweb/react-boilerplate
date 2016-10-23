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

import React from 'react';
import { connect } from 'react-redux';
// import Navbar from 'react-bootstrap/lib/Navbar';
import { Link } from 'react-router';
// import { Nav, NavItem } from 'react-bootstrap';
import styles from './styles.css';
import Notifications from 'containers/Notifications';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: React.PropTypes.node,
    user: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  render() {
    const { user } = this.props;
    const unloggedHide = !user ? { display: 'none' } : {};
    const loggedHide = user ? { display: 'none' } : {};

    return (
      <div className={styles.allContent}>
        <Toolbar>
          <ToolbarGroup firstChild>
            <DropDownMenu value={this.state.value} onChange={this.handleChange} iconStyle={{ fill: 'black' }}>
              <MenuItem value={1} primaryText="Home" containerElement={<Link to="/stellar">Home</Link>} />
              <MenuItem value={2} primaryText="Commandes" containerElement={<Link to={`/relais/${user ? user.relaiId : ''}/commandes`}>Commandes</Link>} style={unloggedHide} />
              <MenuItem value={3} primaryText="Login" containerElement={<Link to="/login">Login</Link>} style={loggedHide} />
              <MenuItem value={4} primaryText="Votre compte" containerElement={<Link to="/votre-compte">Votre compte</Link>} style={unloggedHide} />
              <MenuItem value={6} primaryText="Stellar" containerElement={<Link to="/stellar">Stellar</Link>} />
              <MenuItem value={7} primaryText="Active Text" />
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text="Options" />
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <IconMenu
              iconButtonElement={
                <IconButton touch>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Download" />
              <MenuItem primaryText="More Info" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        <div className={`${styles.mainContent} container-fluid`}>
          {React.Children.toArray(this.props.children)}
        </div>
        <Notifications />
      </div>
    );
  }
}

export default connect((state) => ({ user: state.compteUtilisateur.auth }))(App);
