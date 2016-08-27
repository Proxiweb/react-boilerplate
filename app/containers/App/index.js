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
import Navbar from 'react-bootstrap/lib/Navbar';
import { IndexLink } from 'react-router';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from './styles.css';
import ReduxNotifications from 'containers/Notifications';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    user: React.PropTypes.node,
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        <div className="container">
          <Navbar fixedTop className="hidden-print">
            <Navbar.Header>
              <Navbar.Brand>
                <IndexLink to="/" activeStyle={{ color: 'black' }}>
                  <span>Relais ProxiWeb</span>
                </IndexLink>
              </Navbar.Brand>
            </Navbar.Header>

            <Navbar.Collapse eventKey={0}>
              <Nav navbar pullRight>
                { user && <LinkContainer to="/votre-compte"><NavItem eventKey={5}>Votre compte</NavItem></LinkContainer>}
                { !user && <LinkContainer to="/login"><NavItem eventKey={5}>Login</NavItem></LinkContainer>}
                <LinkContainer to="/commandes"><NavItem eventKey={6}>Commandes</NavItem></LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className={styles.mainContent}>
            {React.Children.toArray(this.props.children)}
          </div>
        </div>
        <ReduxNotifications />
      </div>
    );
  }
}

export default connect(state => ({ user: state.compteUtilisateur.auth }))(App);
